import os
import uuid
import logging
import cv2
import numpy as np
from django.conf import settings
from django.http import FileResponse, Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.base import ContentFile

from .models import ImageJob
from .serializers import ImageUploadSerializer, ImageProcessSerializer, ImageJobSerializer
from utils.image_processing import apply_filter
from utils.histogram import generate_histogram

logger = logging.getLogger(__name__)

def api_response(success, message, data=None, status_code=status.HTTP_200_OK):
    return Response({
        "success": success,
        "message": message,
        "data": data or {}
    }, status=status_code)

class UploadImageView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # Rename file internally to prevent collisions and simplify
            if 'original_image' in request.FILES:
                file = request.FILES['original_image']
                ext = file.name.split('.')[-1].lower()
                new_name = f"input_{uuid.uuid4().hex[:8]}_{file.name}"
                file.name = new_name

            serializer = ImageUploadSerializer(data=request.data)
            if serializer.is_valid():
                job = serializer.save()
                return api_response(
                    success=True, 
                    message="Image uploaded successfully", 
                    data={
                        "job_id": job.id, 
                        "original_image_url": request.build_absolute_uri(job.original_image.url),
                        "created_at": job.created_at
                    }, 
                    status_code=status.HTTP_201_CREATED
                )
            return api_response(False, "Validation error", serializer.errors, status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error uploading image: {str(e)}")
            return api_response(False, str(e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ProcessImageView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            serializer = ImageProcessSerializer(data=request.data)
            if not serializer.is_valid():
                return api_response(False, "Validation error", serializer.errors, status.HTTP_400_BAD_REQUEST)
            
            data = serializer.validated_data
            job = ImageJob.objects.get(id=data['job_id'])
            
            job.status = 'processing'
            job.filter_type = data['filter_type']
            for k, v in data.items():
                if hasattr(job, f'param_{k}'):
                    setattr(job, f'param_{k}', v)
            job.save()

            # Load image using OpenCV
            img_path = job.original_image.path
            img = cv2.imread(img_path)
            
            if img is None:
                raise ValueError("Could not read original image file")

            # Prepare params dict for the dispatcher
            params = {k: v for k, v in data.items() if k not in ['job_id', 'filter_type']}
            
            # Apply filter
            try:
                processed_img = apply_filter(img, job.filter_type, params)
            except Exception as e:
                job.status = 'error'
                job.error_message = str(e)
                job.save()
                return api_response(False, f"Processing failed: {str(e)}", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # Save processed image
            output_filename = f"processed_{job.id}_{job.filter_type}.jpg"
            
            # Encode image
            success, buffer = cv2.imencode('.jpg', processed_img)
            if not success:
                raise ValueError("Could not encode processed image")
                
            io_buf = ContentFile(buffer.tobytes())
            job.processed_image.save(output_filename, io_buf, save=True)
            
            job.status = 'done'
            job.save()
            
            return api_response(
                success=True, 
                message="Image processed successfully", 
                data={
                    "job_id": job.id, 
                    "processed_image_url": request.build_absolute_uri(job.processed_image.url),
                    "filter_type": job.filter_type,
                    "status": job.status
                }
            )
            
        except ImageJob.DoesNotExist:
            return api_response(False, "Job not found", status_code=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error processing image: {str(e)}")
            return api_response(False, str(e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DownloadImageView(APIView):
    def get(self, request, job_id, *args, **kwargs):
        try:
            job = ImageJob.objects.get(id=job_id)
            if not job.processed_image:
                return api_response(False, "Processed image not found", status_code=status.HTTP_404_NOT_FOUND)
                
            file_handle = job.processed_image.open('rb')
            response = FileResponse(file_handle, as_attachment=True, filename=os.path.basename(job.processed_image.name))
            return response
        except ImageJob.DoesNotExist:
            return api_response(False, "Job not found", status_code=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error downloading image: {str(e)}")
            return api_response(False, str(e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

class HistogramView(APIView):
    def get(self, request, job_id, *args, **kwargs):
        try:
            img_type = request.GET.get('type', 'original')
            job = ImageJob.objects.get(id=job_id)
            
            if img_type == 'original':
                img_path = job.original_image.path
            else:
                if not job.processed_image:
                    return api_response(False, "Processed image not found", status_code=status.HTTP_404_NOT_FOUND)
                img_path = job.processed_image.path
                
            img = cv2.imread(img_path)
            if img is None:
                raise ValueError("Could not read image file")
                
            hist_data = generate_histogram(img)
            
            return api_response(True, "Histogram generated", data=hist_data)
        except ImageJob.DoesNotExist:
            return api_response(False, "Job not found", status_code=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error generating histogram: {str(e)}")
            return api_response(False, str(e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

class JobListView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            jobs = ImageJob.objects.all().order_by('-created_at')[:20]
            serializer = ImageJobSerializer(jobs, many=True, context={'request': request})
            return api_response(True, "Jobs retrieved successfully", data=serializer.data)
        except Exception as e:
            logger.error(f"Error retrieving jobs: {str(e)}")
            return api_response(False, str(e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
class JobDetailView(APIView):
    def delete(self, request, job_id, *args, **kwargs):
        try:
            job = ImageJob.objects.get(id=job_id)
            # Delete files from disk
            if job.original_image:
                job.original_image.delete(save=False)
            if job.processed_image:
                job.processed_image.delete(save=False)
                
            job.delete()
            return api_response(True, "Job deleted successfully")
        except ImageJob.DoesNotExist:
            return api_response(False, "Job not found", status_code=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error deleting job: {str(e)}")
            return api_response(False, str(e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
