from django.db import models


class Member(models.Model):
    full_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name


class News(models.Model):
    title = models.CharField(max_length=300)
    content = models.TextField()

    image = models.ImageField(
        upload_to="news/",
        blank=True,
        null=True
    )
    pdf = models.FileField(
        upload_to="news_pdfs/",
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
    name = models.CharField(max_length=200)
    designation = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    address = models.TextField()

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