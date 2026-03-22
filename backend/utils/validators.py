import os
from django.core.exceptions import ValidationError

def validate_image_file_extension(value):
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ['.jpg', '.jpeg', '.png', '.webp', '.bmp']
    if not ext.lower() in valid_extensions:
        raise ValidationError('Unsupported file extension.')

def validate_file_size(value):
    filesize = value.size
    
    # max 20MB
    if filesize > 20971520:
        raise ValidationError("The maximum file size that can be uploaded is 20MB")
    else:
        return value
