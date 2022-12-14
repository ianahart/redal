import jwt
import logging
from typing import Any, Dict, Union
from django.core.mail import EmailMessage

from rest_framework.exceptions import ParseError
from core import settings
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
from services.file_upload import FileUpload
import random

from setting.models import Setting
logger = logging.getLogger('django')


class CustomUserManager(BaseUserManager):
    def update_password(self, password: str, user_id: int):
        user = CustomUser.objects.get(pk=user_id)
        if hashers.check_password(password, user.password):
            return {'type': 'error', 'error': 'Password must not be the same as old password.'}

        user.password = hashers.make_password(password)
        user.save()
        return {'type': 'ok'}

    def __avatar_colors(self):
     colors = ['#FDDB40',
            '#2482E6',
            '#0C7C59',
            '#2B303A',
            '#D64933'
        ]

     random_int = random.randint(0, len(colors) - 1)
     return colors[random_int]



    def forgot_password(self, data):
        try:
            user = CustomUser.objects.filter(email=data['email']).first()
            if user is None:
                raise ObjectDoesNotExist

            token = RefreshToken.for_user(user)
            context = {'user': user.first_name, 'uid': user.id, 'token': token}
            message = render_to_string('forgot-password.html', context)
            refresh = str(token)

            mail = EmailMessage(
                subject="Password reset",
                body=message,
                from_email=settings.EMAIL_SENDER,
                to=[data['email']]
            )
            mail.content_subtype = 'html'
            mail.send()

            return {'type': 'ok', 'data': {'uid': user.id, 'token': refresh}}

        except (ObjectDoesNotExist):
            logger.error('Unable to send password reset email')
            return {'type': 'error', 'data': 'Email address does not exist.'}



    def logout(self, id: int, refresh_token: str):
        user = CustomUser.objects.get(pk=id)
        user.logged_in = False

        token = RefreshToken(refresh_token)
        token.blacklist()

    def change_gender(self, gender, pk: int):
        try:
            user = CustomUser.objects.get(pk=pk)
            user.gender = gender['gender']
            user.save()

        except DatabaseError:
            logger.error('Unable to change user gender.')


    def change_country(self, country, pk: int):
        try:
            print(country)
            user = CustomUser.objects.get(pk=pk)
            user.country = country['country']
            user.save()

        except DatabaseError:
            logger.error('Unable to change user gender.')

    def change_email(self, email: str, refresh_token: str, pk: int):
        try:
            user = CustomUser.objects.get(pk=pk)
            user.email = email
            user.save()
            token = RefreshToken(refresh_token)
            token.blacklist()

        except DatabaseError:
            logger.error('Unable to change user email.')


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
        user.refresh_from_db()
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



    def update_profile(self, pk: int, data: Dict[str, str], file: Dict[str, Any]):
        user = CustomUser.objects.get(pk=pk)
        if file is not None and 'file' in file:
            aws = FileUpload(file['file'], 'avatars')
            if user.avatar_file is not None and len(user.avatar_file) > 0:
               aws.delete(user.avatar_file)
            avatar_url, avatar_file = aws.upload()

            if avatar_url is not None and avatar_file is not None:
                user.avatar_url = avatar_url
                user.avatar_file = avatar_file

        about, display_name = data.values()
        user.about = about
        user.display_name = display_name

        user.save()
        user.refresh_from_db()

        return user



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
    display_name = models.CharField(max_length=30, blank=True, null=True)
    about = models.CharField(max_length=200, blank=True, null=True)
    first_name = models.CharField(max_length=200, blank=True, null=True)
    last_name = models.CharField(max_length=200, blank=True, null=True)
    gender = models.CharField(max_length=50, blank=True, null=True)
    country = models.CharField(max_length=200, default="United States", blank=True, null=True)
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



