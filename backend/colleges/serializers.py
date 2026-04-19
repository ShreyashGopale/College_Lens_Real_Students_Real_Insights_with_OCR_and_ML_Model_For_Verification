from rest_framework import serializers
from .models import College, Course, Facility, GalleryMedia, Cutoff
from django.db.models import Avg


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'college', 'degree_type', 'name', 'fee', 'duration', 'established_year', 'average_package', 'number_of_students']

class FacilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Facility
        fields = ['id', 'name', 'icon']

class CutoffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cutoff
        fields = ['id', 'college', 'course', 'year', 'caste', 'score']

class GalleryMediaSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = GalleryMedia
        fields = ['id', 'college', 'category', 'file', 'file_url', 'media_type', 'title', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at', 'file_url']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None

class CollegeSerializer(serializers.ModelSerializer):
    courses = CourseSerializer(many=True, read_only=True)
    facilities = FacilitySerializer(many=True, read_only=True)
    gallery_media = GalleryMediaSerializer(many=True, read_only=True)
    cutoffs = CutoffSerializer(many=True, read_only=True)
    review_count = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = College
        fields = ['id', 'name', 'location', 'description', 'established_year', 'website', 'image', 'courses', 'facilities', 'gallery_media', 'cutoffs', 'review_count', 'average_rating', 'placement_description', 'average_package', 'highest_package', 'hostel_available', 'hostel_fees', 'bus_available']

    def get_review_count(self, obj):
        return obj.reviews.count()

    def get_average_rating(self, obj):
        avg = obj.reviews.aggregate(Avg('rating'))['rating__avg']
        return round(avg, 1) if avg else 0.0
