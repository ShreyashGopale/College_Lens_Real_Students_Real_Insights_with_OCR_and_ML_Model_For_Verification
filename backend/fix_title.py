import django, os
os.environ['DJANGO_SETTINGS_MODULE'] = 'college_review_backend.settings'
django.setup()

from django.db import connection
cursor = connection.cursor()
cursor.execute("ALTER TABLE reviews_review MODIFY COLUMN title varchar(255) DEFAULT '' NOT NULL")
print("Done — title column now has a default value.")
