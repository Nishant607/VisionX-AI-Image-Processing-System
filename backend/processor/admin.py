from django.contrib import admin
from .models import ImageJob

@admin.register(ImageJob)
class ImageJobAdmin(admin.ModelAdmin):
    list_display = ('id', 'filter_type', 'status', 'created_at', 'updated_at')
    list_filter = ('filter_type', 'status', 'created_at')
    search_fields = ('id', 'filter_type', 'error_message')
    readonly_fields = ('id', 'created_at', 'updated_at')
