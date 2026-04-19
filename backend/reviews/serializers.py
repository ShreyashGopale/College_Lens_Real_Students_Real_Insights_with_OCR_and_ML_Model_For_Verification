from rest_framework import serializers
from .models import Review, Comment, ReviewImage
from users.serializers import UserSerializer

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'user', 'review', 'text', 'created_at']
        read_only_fields = ['user', 'review', 'created_at']

class ReviewImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewImage
        fields = ['id', 'image', 'created_at']

class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    images = ReviewImageSerializer(many=True, read_only=True)
    college_name = serializers.CharField(source='college.name', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'college', 'college_name', 'rating', 'category', 'text', 'is_anonymous', 'created_at', 'comments', 'images']
        read_only_fields = ['user', 'created_at']

    def create(self, validated_data):
        # User is injected from the view
        return Review.objects.create(**validated_data)
