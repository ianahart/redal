import jwt
import logging
from typing import Union
from core import settings
from django.core.mail import EmailMessage
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from django.template.loader import render_to_string
from django.contrib.auth import hashers
from django.db import models, DatabaseError
from rest_framework_simplejwt.backends import TokenBackend
from django.contrib.auth.models import BaseUserManager, AbstractUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist
from datetime import datetime, timedelta, date

logger = logging.getLogger('django')


class CustomUserManager(BaseUserManager):

    def create(self, email: str, password: str, **extra_fields):
        """
        Create and save a User with the given email and password.
        """
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, password=password, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email: str, password: str, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create(email, password, **extra_fields)

    def __user_exists(self, email: str) -> Union['CustomUser', None]:
        return CustomUser.objects.all().filter(email=email).first()



class CustomUser(AbstractUser, PermissionsMixin):
    username = None
    logged_in = models.BooleanField(default=False) #type:ignore
    avatar_file = models.TextField(max_length=500, blank=True, null=True)
    avatar_url = models.URLField(max_length=500, blank=True, null=True)
    password_strength = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    name = models.CharField(unique=True, max_length=200, blank=True, null=True)
    first_name = models.CharField(max_length=200, blank=True, null=True)
    last_name = models.CharField(max_length=200, blank=True, null=True)
    email = models.EmailField(_(
        'email address'),
        unique=True,
        blank=True,
        null=True,
        error_messages={'unique':
                        'A user with this email already exists.'
                        }
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects: CustomUserManager = CustomUserManager()

    def __str__(self):
        return f"{self.email}"

