import { useState, useCallback } from 'react';
import { visionApi } from '../api/visionApi';
import toast from 'react-hot-toast';

export const useImageProcessor = () => {
  const [jobId, setJobId] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [processedUrl, setProcessedUrl] = useState(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({});

  const upload = useCallback(async (file) => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);
    try {
      const res = await visionApi.uploadImage(file, setUploadProgress);
      if (res.success) {
        setJobId(res.data.job_id);
        setOriginalUrl(res.data.original_image_url);
        toast.success('Image uploaded successfully');
      } else {
        throw new Error(res.message || 'Upload failed');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Upload failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const process = useCallback(async (filterType, filterParams = {}) => {
    if (!jobId) {
      toast.error('No image uploaded');
      return;
    }

    setIsProcessing(true);
    setError(null);
    try {
      const payload = {
        job_id: jobId,
        filter_type: filterType,
        ...filterParams
      };
      
      const res = await visionApi.processImage(payload);
      if (res.success) {
        setParams(payload); // Store what was applied
        setProcessedUrl(res.data.processed_image_url);
        toast.success('Filter applied successfully');
      } else {
        throw new Error(res.message || 'Processing failed');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Processing failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  }, [jobId]);

  const reset = useCallback(() => {
    setJobId(null);
    setOriginalUrl(null);
    setProcessedUrl(null);
    setError(null);
    setParams({});
    setUploadProgress(0);
  }, []);

  const download = useCallback(async () => {
    if (!jobId || !processedUrl) {
      toast.error('No processed image to download');
      return;
    }
    try {
      const blob = await visionApi.downloadImage(jobId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `processed_${params.filter_type || 'image'}.jpg`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success('Download started');
    } catch (err) {
      toast.error('Download failed');
    }
  }, [jobId, processedUrl, params]);

  return {
    jobId,
    originalUrl,
    processedUrl,
    isUploading,
    uploadProgress,
    isProcessing,
    error,
    params,
    upload,
    process,
    reset,
    download
  };
};
