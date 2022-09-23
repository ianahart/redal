from django.db import  DatabaseError, models
from django.utils import timezone

from account.models import CustomUser
from services.file_upload import FileUpload
import random
import logging
logger = logging.getLogger('django')

class CommunityManager(models.Manager):
    def create(self, file, user, name, type):
        try:
            aws = FileUpload(file, 'communities')
            image_url, image_filename = aws.upload()
            community = self.model(
                name=name,
                type=type,
                user=user,
                image_url=image_url,
                image_filename=image_filename
            )

            community.save()
        except DatabaseError:
            logger.error('Unable to create a community.')

class Community(models.Model):


    objects: CommunityManager = CommunityManager()

    TYPE_CHOICES = (
        ('public', 'Publc'),
        ('private', 'Private')
    )

    name = models.CharField(max_length=200)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    image_url = models.URLField(blank=True, null=True)
    image_filename = models.TextField(max_length=300, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='community_user'
    )

