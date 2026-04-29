from django.urls import path
from .views import UploadImageView, ProcessImageView, DownloadImageView, HistogramView, JobListView, JobDetailView

urlpatterns = [
    path('upload-image/', UploadImageView.as_view(), name='upload_image'),
    path('process-image/', ProcessImageView.as_view(), name='process_image'),
    path('download/<uuid:job_id>/', DownloadImageView.as_view(), name='download_image'),
    path('histogram/<uuid:job_id>/', HistogramView.as_view(), name='histogram'),
    path('jobs/', JobListView.as_view(), name='job_list'),
    path('jobs/<uuid:job_id>/', JobDetailView.as_view(), name='job_detail'),
]
