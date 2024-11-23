import argparse
import json
import os

import google.auth.transport.requests
import requests
from django.conf import settings
from django.db import transaction
from django.shortcuts import get_object_or_404
from google.oauth2 import service_account
from rest_framework import decorators as rest_decorators
from rest_framework import permissions as rest_permissions
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (AddMob, AppConfig, Menu, MenuItem, Notification,
                     WebsiteDetail)
from .serializers import (AddMobSerializer, AppConfigSerializer,
                          MenuItemSerializer, MenuSerializer,
                          NotificationSerializer, WebsiteDetailSerializer)


class WebsiteDetailListApiView(APIView):
    permission_classes = [rest_permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            web_details = WebsiteDetail.objects.all()
            serializer = WebsiteDetailSerializer(web_details, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as err:
            return Response({'error': str(err)}, status=status.HTTP_400_BAD_REQUEST)
        
    def post(self, request, *args, **kwargs):
        serializer = WebsiteDetailSerializer(data=request.data)
        try:
            if serializer.is_valid():
                title = serializer.validated_data.get('title')
                web_url = serializer.validated_data.get('web_url')
                site_logo = request.FILES.get('site_logo')
                web_details = WebsiteDetail.objects.create(
                    title = title,
                    web_url = web_url,
                    site_logo = site_logo,
                )
                serialized_data = WebsiteDetailSerializer(web_details).data
                return Response(serialized_data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as err:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def put(self, request, *args, **kwargs):
        web_detail_id = kwargs.get('id')
        web_detail = get_object_or_404(WebsiteDetail, id=web_detail_id)
        serializer = WebsiteDetailSerializer(web_detail, data=request.data, partial=True)
        
        try:
            if serializer.is_valid():
                if 'site_logo' in request.data:
                    if web_detail.site_logo and os.path.isfile(web_detail.site_logo.path):
                        os.remove(web_detail.site_logo.path)

                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request, *args, **kwargs):
        web_detail_id = kwargs.get('id')
        web_detail = get_object_or_404(WebsiteDetail, id=web_detail_id)
        
        try:
            web_detail.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    
        
class AppConfigView(APIView):
    permission_classes = [rest_permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            app_config = AppConfig.objects.first()
            if app_config:
                serializer = AppConfigSerializer(app_config)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({"detail": "No data available."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as err:
            return Response({'error': str(err)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, *args, **kwargs):
        try:
            app_config = AppConfig.objects.first()
            if app_config:
                serializer = AppConfigSerializer(app_config, data=request.data)
            else:
                serializer = AppConfigSerializer(data=request.data)

            if serializer.is_valid():
                app_config = serializer.save()
                serialized_data = AppConfigSerializer(app_config).data
                return Response(serialized_data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as err:
            return Response({'error': str(err)}, status=status.HTTP_400_BAD_REQUEST)
        
class MenuView(APIView):
    permission_classes = [rest_permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            menus = Menu.objects.all()
            serializer = MenuSerializer(menus, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as err:
            return Response({'error': str(err)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, *args, **kwargs):
        serializer = MenuSerializer(data=request.data)
        try:
            if serializer.is_valid():
                menu_title = serializer.validated_data.get('menu_title')
                menu = Menu.objects.create(
                    menu_title=menu_title
                )
                serialized_data = MenuSerializer(menu).data
                return Response(serialized_data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as err:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def put(self, request, id, *args, **kwargs):
        menu = get_object_or_404(Menu, id=id)
        serializer = MenuSerializer(menu, data=request.data)
        
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    serializer.save()
                    app_config = AppConfig.objects.first()
                    if app_config:
                        menu_title = serializer.validated_data.get('menu_title')
                        app_config.menu_item = menu_title
                        app_config.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request, *args, **kwargs):
        menu_id = kwargs.get('id')
        menu = get_object_or_404(Menu, id=menu_id)
        if menu:
            menu.delete()
            return Response({'message': 'Menu deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'error': 'Menu not found'}, status=status.HTTP_404_NOT_FOUND)
        
class MenuItemView(APIView):
    permission_classes = [rest_permissions.IsAuthenticated]
    def post(self, request, *args, **kwargs):
        serializer = MenuItemSerializer(data=request.data)
        try:
            if serializer.is_valid():
                title = serializer.validated_data.get('title')
                url = serializer.validated_data.get('url')
                menu_title = request.data.get('menu_title')
                menu_icon = request.FILES.get('menu_icon')
                menu = Menu.objects.get(menu_title=menu_title) if menu_title else None
                menu_item = MenuItem.objects.create(
                    title = title,
                    url = url,
                    menu_icon = menu_icon,
                    menu_id=menu
                )
                serialized_data = MenuItemSerializer(menu_item).data
                return Response(serialized_data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as err:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def put(self, request, *args, **kwargs):
        menu_item_id = kwargs.get('id')
        menu_item = get_object_or_404(MenuItem, id=menu_item_id)
        serializer = MenuItemSerializer(menu_item, data=request.data, partial=True)
        
        try:
            if serializer.is_valid():
                if 'menu_icon' in request.data:
                    if menu_item.menu_icon and os.path.isfile(menu_item.menu_icon.path):
                        os.remove(menu_item.menu_icon.path)

                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request, *args, **kwargs):
        menu_item_id = kwargs.get('id')
        menu_item = get_object_or_404(MenuItem, id=menu_item_id)
        
        try:
            menu_item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class NotificationView(APIView):
    permission_classes = [rest_permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            notifications = Notification.objects.all()
            serializer = NotificationSerializer(notifications, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as err:
            return Response({'error': str(err)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, *args, **kwargs):
        serializer = NotificationSerializer(data=request.data)
        try:
            if serializer.is_valid():
                title = serializer.validated_data.get('title')
                description = serializer.validated_data.get('description')
                notification = Notification.objects.create(
                    title=title,
                    description=description
                )
                serialized_data = NotificationSerializer(notification).data
                return Response(serialized_data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as err:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request, *args, **kwargs):
        notification_id = kwargs.get('id')
        notification = get_object_or_404(Notification, id=notification_id)
        if notification:
            notification.delete()
            return Response({'message': 'Notification deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'error': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)
        
class AddMobAPIView(APIView):
    permission_classes = [rest_permissions.IsAuthenticated]
    def get_object(self):
        return AddMob.objects.first()

    def get(self, request):
        instance = self.get_object()
        if instance:
            serializer = AddMobSerializer(instance)
            return Response(serializer.data)
        return Response({"detail": "No data available."}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        instance = self.get_object()
        if instance:
            serializer = AddMobSerializer(instance, data=request.data)
        else:
            serializer = AddMobSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def _get_access_token():
    credentials = service_account.Credentials.from_service_account_file(
        'service-account.json', scopes=settings.SCOPES)
    request = google.auth.transport.requests.Request()
    credentials.refresh(request)
    return credentials.token

def _send_fcm_message(fcm_message):
  _get_access_token()
  headers = {
    'Authorization': 'Bearer ' + _get_access_token(),
    'Content-Type': 'application/json; UTF-8',
  }
  resp = requests.post(settings.FCM_URL, data=json.dumps(fcm_message), headers=headers)
  return resp
    
@rest_decorators.api_view(["PUT"])
@rest_decorators.permission_classes([rest_permissions.IsAuthenticated])
def push_notification(request, id):
    try:
        notification = Notification.objects.get(id=id)
        if notification:
            common_message = {
                'message': {
                'topic': 'notification',
                'notification': {
                        'title': notification.title,
                        'body': notification.description
                    }
                }
            }
            resp = _send_fcm_message(common_message)
            if resp.status_code == 200:
                response_data = resp.json()
                message_id = response_data.get("name", "").split('/')[-1]
                notification.message_id = message_id
                notification.save()
                notification = NotificationSerializer(notification)
                return Response({"message": "Notification updated successfully", }, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "Unable to send message to Firebase"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"detail": "No data available."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@rest_decorators.api_view(["GET"])
@rest_decorators.permission_classes([])
def webMasterInfo(request):
    try:
        app_config = AppConfig.objects.all()
        app_config_data = AppConfigSerializer(app_config, many=True).data if app_config else {}

        web_details = WebsiteDetail.objects.all()
        web_details_data = WebsiteDetailSerializer(web_details, many=True).data if web_details else {}

        menus = Menu.objects.all()
        menus_data = MenuSerializer(menus, many=True).data if menus else {}

        response_dict = {
            'app_config': app_config_data,
            'web_details': web_details_data,
            'menus': menus_data
        }

        return Response(response_dict, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)