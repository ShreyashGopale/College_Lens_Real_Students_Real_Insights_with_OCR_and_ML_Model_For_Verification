from rest_framework import viewsets, permissions, status, parsers
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .models import Review, Comment, ReviewImage
from .serializers import ReviewSerializer, CommentSerializer
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from collections import Counter
from wordcloud import WordCloud
import nltk
import base64
import io
import re

nltk.download('stopwords', quiet=True)
from nltk.corpus import stopwords

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def perform_create(self, serializer):
        user = self.request.user
        review = serializer.save(user=user)
        images = self.request.FILES.getlist('images')
        for image in images:
            ReviewImage.objects.create(review=review, image=image)

    def get_queryset(self):
        queryset = super().get_queryset()
        college_id = self.request.query_params.get('college')
        if college_id:
            queryset = queryset.filter(college_id=college_id)
        return queryset

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('created_at')
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        review_id = self.kwargs.get('review_pk')
        try:
            review = Review.objects.get(pk=review_id)
        except Review.DoesNotExist:
            raise ValidationError({"detail": "Review not found."})
        serializer.save(user=self.request.user, review=review)

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset

@api_view(['GET'])
@permission_classes([AllowAny])
def college_sentiment(request, college_id):
    reviews = Review.objects.filter(college_id=college_id)
    if not reviews.exists():
        return Response({"error": "No reviews found"}, status=404)

    all_text = " ".join([r.text for r in reviews])
    stop_words = set(stopwords.words('english'))
    words = re.findall(r'\b[a-zA-Z]{3,}\b', all_text.lower())
    filtered_words = [w for w in words if w not in stop_words]

    freq = Counter(filtered_words)

    analyzer = SentimentIntensityAnalyzer()
    word_sentiments = {}
    for word, count in freq.most_common(50):
        score = analyzer.polarity_scores(word)['compound']
        word_sentiments[word] = {
            "count": count,
            "sentiment": "positive" if score > 0.05 else "negative" if score < -0.05 else "neutral"
        }

    wordcloud = WordCloud(width=800, height=400, background_color='white').generate_from_frequencies(freq)

    img_buffer = io.BytesIO()
    wordcloud.to_image().save(img_buffer, format='PNG')
    img_base64 = base64.b64encode(img_buffer.getvalue()).decode('utf-8')

    return Response({
        "wordcloud_image": img_base64,
        "word_sentiments": word_sentiments,
        "total_reviews": reviews.count()
    })
