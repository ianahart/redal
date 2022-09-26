from django.db import models
from django.utils import timezone
from typing import Any, Dict
from django.db import  DatabaseError, models
import random
import logging
import base64
logger = logging.getLogger('django')

class UpVoteManager(models.Manager):


    def create(self, post, user, action):
       try:
            exists = UpVote.objects.all().filter(
                post_id=post.id).filter(
                user_id=user.id).first()

            if exists:
                if exists.action is None:
                    exists.action = action
                else:
                    exists.action = None
                exists.save()
            else:
                upvote = self.model(
                    post=post,
                    user=user,
                    action=action,
                )

                upvote.save()
       except DatabaseError:
            logger.error('Unable to create an upvote.')




class UpVote(models.Model):


    objects: UpVoteManager = UpVoteManager()


    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    action = models.CharField(max_length=20, blank=True, null=True)
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='upvote_user'
    )
    post = models.ForeignKey(
        'post.Post',
        on_delete=models.CASCADE,
        related_name='upvote_post'
    )



