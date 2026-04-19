from django.db import models

class College(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    established_year = models.IntegerField()
    website = models.URLField(blank=True, null=True)
    image = models.ImageField(upload_to='college_images/', blank=True, null=True)
    
    # Placement Details
    placement_description = models.TextField(blank=True, null=True, help_text="Details about placement statistics and companies.")
    average_package = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, help_text="Average package in LPA")
    highest_package = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, help_text="Highest package in LPA")
    
    # Facility Details
    hostel_available = models.BooleanField(default=False)
    hostel_fees = models.CharField(max_length=100, blank=True, null=True, help_text="e.g. ₹50,000/year")
    bus_available = models.BooleanField(default=False)
    
    def __str__(self):
        return self.name

class Course(models.Model):
    college = models.ForeignKey(College, on_delete=models.CASCADE, related_name='courses')
    degree_type = models.CharField(max_length=100, default='B.E/B.TECH') # e.g., B.E/B.TECH, MBA, BCA
    name = models.CharField(max_length=255)
    fee = models.CharField(max_length=100, blank=True, null=True)
    duration = models.CharField(max_length=50) # e.g., "4 Years"
    established_year = models.CharField(max_length=10, blank=True, null=True)
    average_package = models.CharField(max_length=100, blank=True, null=True)
    number_of_students = models.IntegerField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.name} at {self.college.name}"

class Facility(models.Model):
    college = models.ForeignKey(College, on_delete=models.CASCADE, related_name='facilities')
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=50, help_text="Icon name from frontend library")
    
    def __str__(self):
        return f"{self.name} - {self.college.name}"

class GalleryMedia(models.Model):
    CATEGORY_CHOICES = (
        ('classroom', 'Classroom'),
        ('campus', 'Campus'),
        ('library', 'Library'),
        ('hostel', 'Hostel'),
        ('canteen', 'Canteen'),
        ('seminar_hall', 'Seminar Hall'),
        ('ground', 'Ground'),
        ('laboratory', 'Laboratory'),
        ('other', 'Other'),
    )
    MEDIA_TYPE_CHOICES = (
        ('photo', 'Photo'),
        ('video', 'Video'),
    )

    college = models.ForeignKey(College, on_delete=models.CASCADE, related_name='gallery_media')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    file = models.FileField(upload_to='gallery/')
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPE_CHOICES, default='photo')
    title = models.CharField(max_length=255, blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.get_category_display()} - {self.college.name}"

class Cutoff(models.Model):
    CASTE_CHOICES = (
        ('General', 'General'),
        ('OBC', 'OBC'),
        ('SC', 'SC'),
        ('ST', 'ST'),
    )
    college = models.ForeignKey(College, on_delete=models.CASCADE, related_name='cutoffs')
    course = models.CharField(max_length=255)
    year = models.IntegerField()
    caste = models.CharField(max_length=50, choices=CASTE_CHOICES)
    score = models.CharField(max_length=50, help_text="e.g. 95.5%")
    
    class Meta:
        unique_together = ('college', 'course', 'year', 'caste')
        
    def __str__(self):
        return f"{self.college.name} - {self.course} ({self.year}) - {self.caste}: {self.score}"
