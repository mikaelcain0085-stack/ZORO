from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path("admin/", admin.site.urls),

    # API
    path("api/", include("api.urls")),
]

# Note: local media serving removed — images are now served directly
# from Cloudinary via each ImageField's .url, so no static() route
# for MEDIA_URL is needed anymore.