from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path
from web_master_api import urls as web_master_urls

urlpatterns = [
    path('api/auth/', include("account.urls", namespace='account')),
    path('api/', include(web_master_urls)),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
