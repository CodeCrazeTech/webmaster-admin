from rest_framework import serializers

from .models import (AddMob, AppConfig, Menu, MenuItem, Notification,
                     WebsiteDetail)


class WebsiteDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteDetail
        fields = "__all__"


class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = "__all__"

class MenuSerializer(serializers.ModelSerializer):
    menu_item = MenuItemSerializer(many=True, read_only=True, source='menuitem_set')
    class Meta:
        model = Menu
        fields = "__all__"
        
class AppConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppConfig
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class AddMobSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddMob
        fields = '__all__'