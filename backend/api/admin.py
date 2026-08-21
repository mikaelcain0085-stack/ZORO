from django.contrib import admin
from .models import Member, News, Photo, Leader


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ("full_name", "phone", "email", "created_at")
    search_fields = ("full_name", "phone", "email")


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ("title", "created_at")
    search_fields = ("title", "content")


@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ("description", "created_at")
    search_fields = ("description",)


@admin.register(Leader)
class LeaderAdmin(admin.ModelAdmin):
    list_display = ("name", "designation", "phone", "created_at")
    search_fields = ("name", "designation", "phone")