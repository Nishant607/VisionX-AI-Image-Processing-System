from rest_framework import serializers
from .models import ImageJob

class ImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageJob
        fields = ['original_image']

    def validate_original_image(self, value):
        # Validate file size (max 20MB)
        if value.size > 20 * 1024 * 1024:
            raise serializers.ValidationError("File size must be under 20MB.")
        
        # Validate file type
        valid_extensions = ['jpg', 'jpeg', 'png', 'webp', 'bmp']
        ext = value.name.split('.')[-1].lower()
        if ext not in valid_extensions:
            raise serializers.ValidationError("Unsupported file extension. Allowed: jpg, png, webp, bmp")
            
        return value

class ImageProcessSerializer(serializers.Serializer):
    job_id = serializers.UUIDField()
    filter_type = serializers.ChoiceField(choices=ImageJob.FILTER_CHOICES)
    
    # Optional params
    threshold1 = serializers.IntegerField(required=False)
    threshold2 = serializers.IntegerField(required=False)
    ksize = serializers.IntegerField(required=False)
    direction = serializers.CharField(required=False)
    brightness = serializers.FloatField(required=False)
    contrast = serializers.FloatField(required=False)
    strength = serializers.FloatField(required=False)

    def validate(self, data):
        """
        Validate all filter params based on filter_type
        """
        filter_type = data.get('filter_type')
        if filter_type == 'canny':
            if 'threshold1' not in data or 'threshold2' not in data:
                raise serializers.ValidationError("Canny filter requires threshold1 and threshold2.")
        elif filter_type in ['gaussian_blur', 'median_filter', 'sobel']:
            if 'ksize' not in data:
                raise serializers.ValidationError(f"{filter_type} requires ksize.")
            if data['ksize'] % 2 == 0:
                raise serializers.ValidationError("ksize must be an odd number.")
        return data

class ImageJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageJob
        fields = '__all__'
        
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        request = self.context.get('request')
        
        # Ensure absolute URLs
        if instance.original_image and request:
            ret['original_image'] = request.build_absolute_uri(instance.original_image.url)
        if instance.processed_image and request:
            ret['processed_image'] = request.build_absolute_uri(instance.processed_image.url)
            
        return ret
