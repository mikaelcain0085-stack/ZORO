from rest_framework.routers import DefaultRouter
from .views import (
    MemberViewSet,
    NewsViewSet,
    PhotoViewSet,
    LeaderViewSet,
    EnquiryViewSet,
)

router = DefaultRouter()

router.register(r"members", MemberViewSet)
router.register(r"news", NewsViewSet)
router.register(r"photos", PhotoViewSet)
router.register(r"leaders", LeaderViewSet)
router.register(r"enquiries", EnquiryViewSet)

urlpatterns = router.urls