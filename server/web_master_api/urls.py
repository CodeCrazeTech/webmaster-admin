from django.urls import path

from .views import *

urlpatterns = [
    path('web-details', WebsiteDetailListApiView.as_view()),
    path('web-details/<int:id>/', WebsiteDetailListApiView.as_view()),
    path('app-config', AppConfigView.as_view(), name='app-config'),
    path('app-config/<int:id>/', AppConfigView.as_view(), name='app-config'),
    path('menu', MenuView.as_view(), name='menu'),
    path('menu/<int:id>/', MenuView.as_view()),
    path('menu-item', MenuItemView.as_view(), name='menu-item'),
    path('menu-item/<int:id>/', MenuItemView.as_view(), name='menu-item'),
    path('notification', NotificationView.as_view(), name='notify'),
    path('notification/<int:id>/', NotificationView.as_view(), name='notification'),
    path('add-mob', AddMobAPIView.as_view(), name='notification'),
    path('push-notification/<int:id>/', push_notification, name='push_notification'),
    path('web_master_details', webMasterInfo, name="web_master_info"),
    
]