import uuid
from django.db import models

class ImageJob(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('done', 'Done'),
        ('error', 'Error'),
    ]

    FILTER_CHOICES = [
        # Edge Detection
        ('canny', 'Canny Edge Detection'),
        ('sobel', 'Sobel Filter'),
        ('laplacian', 'Laplacian Filter'),
        ('contour', 'Contour Detection'),
        # Enhancement
        ('histogram_eq', 'Histogram Equalization'),
        ('contrast_stretch', 'Contrast Stretching'),
        ('brightness_contrast', 'Brightness / Contrast'),
        # Smoothing
        ('gaussian_blur', 'Gaussian Blur'),
        ('median_filter', 'Median Filter'),
        # Advanced
        ('document_scanner', 'Document Scanner'),
        ('unsharp_mask', 'Unsharp Mask'),
        ('auto_white_balance', 'Auto White Balance'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    original_image = models.ImageField(upload_to='input/')
    processed_image = models.ImageField(upload_to='output/', null=True, blank=True)
    filter_type = models.CharField(max_length=50, choices=FILTER_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Filter Parameters (nullable as they vary by filter)
    param_threshold1 = models.IntegerField(null=True, blank=True)
    param_threshold2 = models.IntegerField(null=True, blank=True)
    param_ksize = models.IntegerField(null=True, blank=True)
    param_direction = models.CharField(max_length=20, null=True, blank=True)
    param_brightness = models.FloatField(null=True, blank=True)
    param_contrast = models.FloatField(null=True, blank=True)
    param_strength = models.FloatField(null=True, blank=True)

    error_message = models.TextField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.id} - {self.filter_type} ({self.status})"
