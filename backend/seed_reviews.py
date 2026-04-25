"""
Seed script to populate reviews for three colleges with diverse sentiments,
categories, and a mix of named + anonymous reviewers.
"""
import os, django
os.environ['DJANGO_SETTINGS_MODULE'] = 'college_review_backend.settings'
django.setup()

from users.models import User
from reviews.models import Review
from colleges.models import College
from datetime import timedelta
from django.utils import timezone

# ── Helper: get or create a student user ──────────────────────
def get_or_create_user(username):
    user, _ = User.objects.get_or_create(
        username=username,
        defaults={'role': 'student', 'password': 'unusable'}
    )
    return user

# ── Reviewer pool ─────────────────────────────────────────────
reviewers = {
    'rahul_sharma':    get_or_create_user('rahul_sharma'),
    'priya_patil':     get_or_create_user('priya_patil'),
    'amit_deshmukh':   get_or_create_user('amit_deshmukh'),
    'sneha_kulkarni':  get_or_create_user('sneha_kulkarni'),
    'vikram_jadhav':   get_or_create_user('vikram_jadhav'),
    'ananya_reddy':    get_or_create_user('ananya_reddy'),
    'rohit_gupta':     get_or_create_user('rohit_gupta'),
    'megha_joshi':     get_or_create_user('megha_joshi'),
    'aditya_more':     get_or_create_user('aditya_more'),
    'kavita_naik':     get_or_create_user('kavita_naik'),
    'suresh_pawar':    get_or_create_user('suresh_pawar'),
    'pooja_singh':     get_or_create_user('pooja_singh'),
    'nikhil_verma':    get_or_create_user('nikhil_verma'),
    'deepika_rane':    get_or_create_user('deepika_rane'),
    'arjun_bhosale':   get_or_create_user('arjun_bhosale'),
    'shruti_wagh':     get_or_create_user('shruti_wagh'),
    'manish_thakur':   get_or_create_user('manish_thakur'),
    'riya_chavan':     get_or_create_user('riya_chavan'),
}

# ── College IDs ───────────────────────────────────────────────
COLLEGES = {
    'GGSCOERC': 4,   # Guru Gobind Singh College of Engineering and Research Centre
    'MET':      2,   # MET Bhujbal Knowledge City
    'SVIT':     3,   # Sir Visvesvaraya Institute of Technology, Nashik (SVIT)
}

# ── Review data ───────────────────────────────────────────────
# Each tuple: (username, college_key, rating, category, is_anonymous, text)

REVIEWS = [
    # ═══════════════════════════════════════════════════════════
    # GURU GOBIND SINGH COLLEGE (GGSCOERC) — 8 reviews
    # ═══════════════════════════════════════════════════════════

    # Positive — Infrastructure
    ('rahul_sharma', 'GGSCOERC', 5, 'infrastructure',  False,
     "The campus infrastructure at GGSCOERC is truly world-class. The new academic building with smart classrooms, "
     "well-equipped computer labs, and a spacious library create an ideal learning environment. The college has invested "
     "heavily in modernizing all facilities and it really shows in the day-to-day student experience."),

    # Positive — Teaching
    ('priya_patil', 'GGSCOERC', 4, 'teaching',  False,
     "Most of the faculty members at Guru Gobind Singh are highly qualified and experienced. They go above and beyond "
     "to clear doubts even after lectures. The teaching methodology includes practical sessions and industry projects "
     "which makes learning very effective and engaging for all branches."),

    # Negative — Placements
    ('amit_deshmukh', 'GGSCOERC', 2, 'placements',  True,
     "The placement cell needs serious improvement. Only a handful of companies visit campus each year and most offer "
     "packages below 4 LPA. Students from non-CS branches struggle a lot to get placed. The training and placement "
     "department should collaborate with more IT companies and startups to improve opportunities."),

    # Neutral — Facilities
    ('sneha_kulkarni', 'GGSCOERC', 3, 'facilities',  False,
     "The canteen food is decent but could have more variety. The hostel rooms are average with basic amenities. "
     "WiFi connectivity is inconsistent across the campus — it works well in the library but barely connects in the "
     "hostel blocks. Sports facilities are available but not regularly maintained."),

    # Positive — Other (Campus Life)
    ('vikram_jadhav', 'GGSCOERC', 5, 'other',  False,
     "Campus life at GGSCOERC is absolutely vibrant! The annual tech fest and cultural events are organized with "
     "great enthusiasm. There are numerous clubs for coding, robotics, and music. The NSS and social outreach programs "
     "are also very active. I have made lifelong friendships and unforgettable memories here."),

    # Negative — Teaching
    ('ananya_reddy', 'GGSCOERC', 2, 'teaching',  True,
     "Some of the professors are outdated in their teaching methods and just read from textbooks without any real-world "
     "examples. The syllabus is not updated to match current industry requirements. Practical lab sessions are rushed "
     "and there is little focus on hands-on skills that actually matter for employability."),

    # Positive — Placements
    ('rohit_gupta', 'GGSCOERC', 4, 'placements',  False,
     "I got placed through campus recruitment at a reputed IT firm with a decent package. The placement cell has been "
     "improving steadily over the last two years. Companies like TCS, Infosys, and Wipro regularly visit now. "
     "Mock interviews and aptitude training sessions helped me prepare well for the selection process."),

    # Neutral — Infrastructure
    ('megha_joshi', 'GGSCOERC', 3, 'infrastructure',  True,
     "The college building is fairly well maintained but some classrooms in the older block need renovation. "
     "The labs have sufficient equipment for practicals but the latest software tools are missing in a few departments. "
     "The parking area is congested during peak hours and needs to be expanded urgently."),


    # ═══════════════════════════════════════════════════════════
    # MET BHUJBAL KNOWLEDGE CITY — 8 reviews
    # ═══════════════════════════════════════════════════════════

    # Positive — Infrastructure
    ('aditya_more', 'MET', 5, 'infrastructure',  False,
     "MET BKC has one of the most beautiful campuses in Nashik. The lush green environment, modern architecture, and "
     "well-maintained gardens make it a pleasure to study here. The auditorium, seminar halls, and advanced labs are "
     "truly impressive. It feels like studying in a top-tier institution every single day."),

    # Positive — Teaching
    ('kavita_naik', 'MET', 4, 'teaching',  False,
     "The teaching staff at MET is highly knowledgeable and approachable. Many professors have industry experience and "
     "bring real-world case studies into the classroom. Regular workshops and guest lectures from industry experts add "
     "tremendous value to the academic curriculum and broaden our perspective significantly."),

    # Negative — Facilities
    ('suresh_pawar', 'MET', 2, 'facilities',  True,
     "The hostel management at MET leaves much to be desired. The food quality is inconsistent and the mess timings "
     "are very rigid. Hot water supply is unreliable during winter months. Also, the hostel WiFi is painfully slow "
     "and barely usable for downloading study materials or attending online sessions."),

    # Positive — Placements
    ('pooja_singh', 'MET', 5, 'placements',  False,
     "MET BKC has an outstanding placement record! Top companies like Amazon, Microsoft, and Deloitte visit our "
     "campus regularly. The placement cell provides excellent pre-placement training including aptitude tests, "
     "group discussions, and mock interviews. The average package has been consistently increasing year after year."),

    # Negative — Teaching
    ('nikhil_verma', 'MET', 2, 'teaching',  True,
     "While some professors are brilliant, there are a few who are disinterested and just go through the motions. "
     "Internal assessment marking can feel arbitrary and biased at times. The university exam pattern is heavily "
     "theory-based which doesn't test actual understanding or practical skills of the students effectively."),

    # Neutral — Other
    ('deepika_rane', 'MET', 3, 'other',  False,
     "The college has a decent cultural scene with regular events and competitions. However, the management can be "
     "strict about attendance and dress code policies. The location in Nashik is convenient with good connectivity. "
     "Overall, it's an average experience — nothing extraordinary but nothing terrible either."),

    # Positive — Facilities
    ('arjun_bhosale', 'MET', 4, 'facilities',  False,
     "The sports facilities at MET are excellent — indoor badminton courts, a well-maintained cricket ground, and "
     "a fully equipped gym are available for students. The library is spacious with a huge collection of reference "
     "books and online journal subscriptions. The campus also has a dedicated innovation and incubation center."),

    # Negative — Infrastructure
    ('shruti_wagh', 'MET', 2, 'infrastructure',  True,
     "Despite the fancy exterior, some internal infrastructure issues exist. Air conditioning in classrooms is "
     "frequently broken, especially during the summer months when it is needed the most. Elevator availability is "
     "limited and washroom maintenance is below acceptable standards. These basic facilities need urgent attention."),


    # ═══════════════════════════════════════════════════════════
    # SIR VISVESVARAYA INSTITUTE OF TECHNOLOGY (SVIT) — 8 reviews
    # ═══════════════════════════════════════════════════════════

    # Positive — Teaching
    ('manish_thakur', 'SVIT', 5, 'teaching',  False,
     "SVIT Nashik has some of the most dedicated professors I have ever met. They genuinely care about student "
     "success and are always available for guidance. The mentoring system pairs each student with a faculty advisor "
     "which helps in academic planning and career development. Teaching quality is consistently excellent."),

    # Positive — Infrastructure
    ('riya_chavan', 'SVIT', 4, 'infrastructure',  False,
     "The campus of SVIT is well-designed with separate blocks for each department. The computer labs have the latest "
     "hardware and software configurations. The recently renovated library with digital access to IEEE and Springer "
     "journals is a huge advantage for research-oriented students. Classrooms are clean and well-ventilated."),

    # Negative — Placements
    ('rahul_sharma', 'SVIT', 2, 'placements',  True,
     "Placement statistics at SVIT are disappointing for non-IT branches. Mechanical and Civil engineering students "
     "barely get any campus opportunities. The placement cell focuses almost exclusively on CS and IT students. "
     "There is an urgent need to invite core engineering companies and diversify the recruitment process."),

    # Positive — Facilities
    ('priya_patil', 'SVIT', 4, 'facilities',  False,
     "The hostel at SVIT is comfortable with well-furnished rooms, 24/7 water supply, and reliable WiFi. The canteen "
     "offers a good variety of food at reasonable prices. The medical facility on campus is helpful for emergencies. "
     "Transportation services cover major routes in Nashik making the daily commute very convenient."),

    # Negative — Teaching
    ('amit_deshmukh', 'SVIT', 2, 'teaching',  True,
     "Some senior professors are stuck in old-school teaching methods and refuse to adopt modern tools. There is too "
     "much emphasis on rote learning rather than conceptual understanding. Lab assistants are often unavailable and "
     "students have to figure out experiments on their own which defeats the purpose of guided practicals."),

    # Neutral — Other
    ('sneha_kulkarni', 'SVIT', 3, 'other',  False,
     "College life at SVIT is balanced — not too hectic and not too relaxed. The technical events and hackathons are "
     "well-organized but cultural activities could be more frequent. The alumni network is growing but still not as "
     "strong as some other colleges in the region. Overall, a decent place to pursue your engineering degree."),

    # Positive — Placements
    ('vikram_jadhav', 'SVIT', 5, 'placements',  False,
     "SVIT's placement record for CS and IT branches is genuinely impressive. Companies like Cognizant, Capgemini, "
     "Persistent Systems, and several startups visit regularly. The highest package offered last year crossed 12 LPA "
     "which is remarkable for a college in Nashik. Career guidance sessions and resume workshops are very helpful."),

    # Negative — Facilities
    ('ananya_reddy', 'SVIT', 2, 'facilities',  True,
     "The college gym is outdated with broken equipment that hasn't been replaced in years. The ground is shared with "
     "multiple sports making it difficult to practice properly. Library seating is extremely limited during exam season "
     "and students have to sit on staircases to study. Basic facility maintenance is severely lacking here."),
]


# ── Seed the database ─────────────────────────────────────────
base_time = timezone.now() - timedelta(days=120)
created = 0

for i, (username, college_key, rating, category, is_anon, text) in enumerate(REVIEWS):
    user = reviewers[username]
    college_id = COLLEGES[college_key]
    college = College.objects.get(id=college_id)

    # Check if a review with the same text already exists to avoid duplicates
    if Review.objects.filter(user=user, college=college, text=text).exists():
        print(f"  SKIP (exists): {username} -> {college.name}")
        continue

    review = Review.objects.create(
        user=user,
        college=college,
        rating=rating,
        category=category,
        text=text,
        is_anonymous=is_anon,
    )
    # Manually set created_at to spread reviews over time
    review.created_at = base_time + timedelta(days=i * 5, hours=i * 3)
    review.save(update_fields=['created_at'])
    created += 1
    label = "Anonymous" if is_anon else username
    print(f"  OK [{rating}*] {label} -> {college.name} ({category})")

print(f"\nDone! Created {created} reviews.")
