import os

from django.db import models
from django.db.models.signals import pre_delete, pre_save
from django.dispatch import receiver


def upload_path(instance,filename):
    model_name = instance.__class__.__name__
    print(model_name)
    if model_name == 'AppConfig':
        path = 'app_logo'
    elif model_name == 'MenuItem':
        path = 'menu_icons'
    elif model_name == 'WebsiteDetail':
        path = 'sitelogos'
    return '/'.join([path,filename.format(filename=filename)])

class WebsiteDetail(models.Model):
    title = models.CharField(max_length=150)
    web_url = models.URLField()
    site_logo = models.ImageField(upload_to=upload_path)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    
    def delete(self, *args, **kwargs):
        if self.site_logo:
            if os.path.isfile(self.site_logo.path):
                os.remove(self.site_logo.path)
        super().delete(*args, **kwargs)
    
class Menu(models.Model):
    menu_title = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.menu_title

class MenuItem(models.Model):
    title = models.CharField(max_length=100)
    menu_id = models.ForeignKey(Menu, on_delete = models.CASCADE, blank = True, null = True)
    url = models.CharField(max_length=200)
    menu_icon = models.ImageField(upload_to=upload_path)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    
    def delete(self, *args, **kwargs):
        if self.menu_icon:
            if os.path.isfile(self.menu_icon.path):
                os.remove(self.menu_icon.path)
        super().delete(*args, **kwargs)

@receiver(pre_delete, sender=Menu)
def delete_related_menu_items(sender, instance, **kwargs):
    for menu_item in instance.menuitem_set.all():
        menu_item.delete()

class AppConfig(models.Model):
    app_name = models.CharField(max_length=100)
    app_url = models.CharField(max_length=100)
    primary_color = models.CharField(max_length=100)
    menu_item = models.CharField(max_length=100)
    app_logo = models.ImageField(upload_to=upload_path, null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.pk:
            try:
                old_instance = AppConfig.objects.get(pk=self.pk)
                if old_instance.app_logo and old_instance.app_logo != self.app_logo:
                    old_instance.app_logo.delete(save=False)
            except AppConfig.DoesNotExist:
                pass
        super().save(*args, **kwargs)

@receiver(pre_save, sender=AppConfig)
def ensure_single_row(sender, instance, **kwargs):
    if AppConfig.objects.exists() and not AppConfig.objects.filter(pk=instance.pk).exists():
        raise ValueError("Only one AppConfig instance is allowed.")

    
class Notification(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    message_id = models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class AddMob(models.Model):
    ios_app_id = models.CharField(max_length=100, null=True, blank=True)
    android_app_id = models.CharField(max_length=100, null=True, blank=True)
    show_bannar_ad_android = models.BooleanField(default=False)
    show_bannar_ad_ios = models.BooleanField(default=False)

@receiver(pre_save, sender=AddMob)
def ensure_single_row(sender, instance, **kwargs):
    if AddMob.objects.exists() and not AddMob.objects.filter(pk=instance.pk).exists():
        raise ValueError("Only one AddMob instance is allowed.")


