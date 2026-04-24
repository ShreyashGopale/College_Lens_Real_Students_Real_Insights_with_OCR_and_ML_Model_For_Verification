import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "college_review_backend.settings")
django.setup()

from colleges.models import College
from reviews.models import Review
from django.contrib.auth import get_user_model

User = get_user_model()

# Test user create
user, created = User.objects.get_or_create(
    username='reviewer',
    defaults={'email': 'reviewer@test.com', 'role': 'student'}
)

if created:
    user.set_password('reviewer123')
    user.save()

# 30 Reviews (Positive + Neutral + Negative)
reviews_data = [
    # 👍 Positive (10)
    "Great college with excellent faculty and good infrastructure. Very helpful professors and amazing campus life.",
    "The placement opportunities are very good. Many companies visit for recruitment every year.",
    "Campus facilities are well maintained. Library, labs and sports areas are good.",
    "Faculty is experienced and always ready to help students.",
    "College has a vibrant cultural life with regular fests and events.",
    "Research opportunities are good and students get practical exposure.",
    "Hostel facilities are comfortable and food quality is decent.",
    "The college has a strong alumni network which helps students.",
    "Infrastructure is modern and computer labs are well equipped.",
    "Overall a very good college experience with supportive environment.",

    # 😐 Neutral (10)
    "College is decent but there is scope for improvement in placements.",
    "Placement opportunities are average compared to top colleges.",
    "Campus is good but lacks some advanced facilities.",
    "Faculty is okay but teaching quality varies by department.",
    "College life is fine but not very exciting.",
    "Hostel facilities are manageable but can improve.",
    "Labs are available but some equipment is outdated.",
    "Administration works but sometimes response is slow.",
    "Events are conducted but not very frequently.",
    "Overall experience is average and depends on student efforts.",

    # 👎 Negative (10)
    "Placement opportunities are limited especially for core branches.",
    "Infrastructure needs improvement in many areas.",
    "Some faculty members are not very supportive.",
    "College lacks proper industry exposure and training.",
    "Hostel facilities are not well maintained.",
    "Canteen food quality is poor and repetitive.",
    "Administrative process is slow and frustrating.",
    "More focus on theory and less on practical learning.",
    "Very limited extracurricular activities available.",
    "Overall not satisfied with the college experience."
]

colleges = College.objects.all()

for college in colleges:
    print(f"Adding reviews for {college.name}...")
    for i, text in enumerate(reviews_data):
        Review.objects.create(
            user=user,
            college=college,
            rating=(i % 5) + 1,
            text=text,
            is_anonymous=(i % 2 == 0)
        )
    print(f"Done! {len(reviews_data)} reviews added for {college.name}")

print("All reviews populated!")
