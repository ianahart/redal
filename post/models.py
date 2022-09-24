from django.db import models
from django.utils import timezone
from typing import Any, Dict
from django.db import  DatabaseError, models
from services.file_upload import FileUpload
import random
import logging
import base64
logger = logging.getLogger('django')

class PostManager(models.Manager):
    def create(self, validated_data: Dict[str, Any]):
       try:
            post = validated_data['post']['ops']

            instance = self.model(
              community=validated_data['community'],
              user=validated_data['user'],
              post=post,
              title=validated_data['title'],
              avatar_url=validated_data['avatar_url'],
              initials=validated_data['initials']
            )
            instance.save()
       except Exception as e:
            print(e)
            logger.error('Unable to create a community post.')
       



class Post(models.Model):


    objects: PostManager = PostManager()


    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    post = models.JSONField(blank=True, null=True)
    title = models.CharField(max_length=200)
    avatar_url = models.TextField(max_length=500, blank=True, null=True)
    avatar_filename = models.CharField(max_length=200, blank=True, null=True)
    initials = models.CharField(max_length=5, blank=True, null=True)
    tags = models.JSONField(blank=True, null=True)
    community = models.ForeignKey(
    'community.Community',
    on_delete=models.CASCADE,
    related_name='post_communities',
        blank=True,
        null=True
)
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='post_user'
    )


