from django.db import models
from cloudinary_storage.storage import RawMediaCloudinaryStorage


class Member(models.Model):
    full_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name


class News(models.Model):
    STATUS_DRAFT = "draft"
    STATUS_PUBLISHED = "published"
    STATUS_CHOICES = [
        (STATUS_DRAFT, "Draft"),
        (STATUS_PUBLISHED, "Published"),
    ]

    title = models.CharField(max_length=300)
    subheadline = models.CharField(max_length=400, blank=True)
    content = models.TextField()

    author = models.CharField(max_length=150, blank=True)
    category = models.CharField(max_length=100, blank=True, default="General")
    publish_date = models.DateField(blank=True, null=True)

    is_front_page = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    columns = models.PositiveSmallIntegerField(default=2)  # 2 or 3
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default=STATUS_PUBLISHED,
    )

    image = models.ImageField(
        upload_to="news/",
        blank=True,
        null=True
    )
    pdf = models.FileField(
        upload_to="news_pdfs/",
        storage=RawMediaCloudinaryStorage(),
        blank=True,
        null=True
    )


    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Photo(models.Model):
    description = models.TextField()

    image = models.ImageField(
        upload_to="photos/"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.description[:50]


class Leader(models.Model):
    STATUS_CURRENT = "current"
    STATUS_PREVIOUS = "previous"
    STATUS_CHOICES = [
        (STATUS_CURRENT, "Current"),
        (STATUS_PREVIOUS, "Previous"),
    ]

    name = models.CharField(max_length=200)
    designation = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    address = models.TextField()

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default=STATUS_CURRENT,
    )
    year = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        help_text="e.g. 2015 or 2015-2019. Only used for Previous leaders.",
    )

    image = models.ImageField(
        upload_to="leaders/",
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.designation}"

class Enquiry(models.Model):
    name = models.CharField(max_length=200)

    email = models.EmailField()

    phone = models.CharField(
        max_length=20,
        blank=True
    )

    subject = models.CharField(
        max_length=300
    )

    message = models.TextField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.subject} - {self.name}"    
