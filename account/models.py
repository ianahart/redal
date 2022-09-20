import jwt
import logging
from typing import Union

from rest_framework.exceptions import ParseError
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
import random
logger = logging.getLogger('django')


class CustomUserManager(BaseUserManager):


    def __avatar_colors(self):
     colors = ['#FDDB40',
            '#2482E6',
            '#0C7C59',
            '#2B303A',
            '#D64933'
        ]

     random_int = random.randint(0, len(colors) - 1)
     return colors[random_int]



    def logout(self, id: int, refresh_token: str):
        user = CustomUser.objects.get(pk=id)
        user.logged_in = False

        token = RefreshToken(refresh_token)
        token.blacklist()


    def create(self, email: str, password: str, **extra_fields):
        """
        Create and save a User with the given email and password.
        """
        extra_fields['color'] = self.__avatar_colors()
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




    def user_by_token(self, user: 'CustomUser', token: str):
        decoded_token = None
        try:
            decoded_token = TokenBackend(
                algorithm='HS256'
            ).decode(token.split('Bearer ')[1], verify=False)

        except IndexError:
            logger.error('Malformed token inside get user by token')

        if decoded_token is not None:
            obj = CustomUser.objects.get(pk=decoded_token['user_id'])
            return None if obj.pk != user.pk else obj


    def login(self, email: str, password: str):
        try:
            user = self.__user_exists(email=email)

            if user is None:
                raise ParseError('User does not exist.')


            if not hashers.check_password(password, user.password):
                raise ParseError('Invalid credentials.')



            refresh_token = RefreshToken.for_user(user)
            access_token = refresh_token.access_token
            access_token.set_exp(lifetime=timedelta(days=3))

            tokens = {
                'access_token': str(access_token),
                'refresh_token': str(refresh_token)
            }

            user.logged_in = True #type:ignore
            user.save()
            user.refresh_from_db()

            return {'type': 'ok', 'user': user, 'tokens': tokens}
        except ParseError as e:
            return {'type': 'error', 'msg': e.detail}

class CustomUser(AbstractUser, PermissionsMixin):
    username = None
    logged_in = models.BooleanField(default=False) #type:ignore
    avatar_file = models.TextField(max_length=500, blank=True, null=True)
    avatar_url = models.URLField(max_length=500, blank=True, null=True)
    password_strength = models.CharField(max_length=50, blank=True, null=True)
    color = models.CharField(max_length=50, blank=True, null=True)
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

    @property
    def initials(self):
        return str(self.first_name)[0:1] + str(self.last_name)[0:1]


