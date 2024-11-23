import os
from enum import unique

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models


class AccountManager(BaseUserManager):
    def create_user(self, email, username, password=None, **kwargs):
        
        if not email:
            raise ValueError("Email is required")

        if not username:
            raise ValueError("Username is required")

        user = self.model(
            email=self.normalize_email(email),
            username = username,
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, username, password, **kwargs):
        user = self.create_user(
            email=self.normalize_email(email),
            username = username,
            password = password
        )

        user.is_admin = True
        user.is_staff = True
        user.is_superuser= True
        user.save(using=self._db)
        return 

def upload_path(instance,filename):
    model_name = instance.__class__.__name__
    print('42-->',model_name)
    path = 'profile_pictures'
    return '/'.join([path,filename.format(filename=filename)])

class Account(AbstractBaseUser):
    email = models.EmailField(null=False, blank=False, unique=True)
    username = models.CharField(max_length=50, blank=False, null=False, unique=True)
    profile_picture = models.ImageField(upload_to=upload_path, null=True, blank=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = AccountManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    def __str__(self):
        return self.username

    def has_perm(self, perm, obj=None):
         return True

    def has_module_perms(self, app_label):
        return True
    
    def delete_old_profile_image(self):
        if self.profile_picture and os.path.isfile(self.profile_picture.path):
            os.remove(self.profile_picture.path)