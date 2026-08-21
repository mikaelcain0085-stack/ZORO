from rest_framework import viewsets
from .models import Member, News, Photo, Leader, Enquiry
from .serializers import (
    MemberSerializer,
    NewsSerializer,
    PhotoSerializer,
    LeaderSerializer,
    EnquirySerializer,
)


class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all().order_by("-created_at")
    serializer_class = MemberSerializer


class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all().order_by("-created_at")
    serializer_class = NewsSerializer


class PhotoViewSet(viewsets.ModelViewSet):
    queryset = Photo.objects.all().order_by("-created_at")
    serializer_class = PhotoSerializer


class LeaderViewSet(viewsets.ModelViewSet):
    queryset = Leader.objects.all().order_by("-created_at")
    serializer_class = LeaderSerializer

class EnquiryViewSet(viewsets.ModelViewSet):
    queryset = Enquiry.objects.all().order_by("-created_at")
    serializer_class = EnquirySerializer