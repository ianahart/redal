from django.db import models
from django.utils import timezone
from typing import Any, Dict
from django.db import  DatabaseError, models
import random
import logging
import base64
logger = logging.getLogger('django')

class CommentManager(models.Manager):
    def create(self):
       try:
            print('create')
       except DatabaseError:
            logger.error('Unable to create a comment.')



class Comment(models.Model):


    objects: CommentManager = CommentManager()


    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='comment_user'
    )
    post = models.ForeignKey(
        'post.Post',
        on_delete=models.CASCADE,
        related_name='comment_post'
    )




