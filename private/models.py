from django.db import models
from django.utils import timezone
import logging
logger = logging.getLogger('django')
from invite.models import Invite

class PrivateManager(models.Manager):
    def create(self, data):
        private = self.model(
            community=data['community'],
            user=data['user']
        )

        private.save()


        invite = Invite.objects.get(pk=data['invite_id'])
        invite.delete()



    def author(self, data):
        private = self.model(
            community=data['community'],
            user=data['user']
        )

        private.save()


class Private(models.Model):

    objects:PrivateManager = PrivateManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='private_user'
    )

    community = models.ForeignKey(
        'community.Community',
        on_delete=models.CASCADE,
        related_name='private_community'
    )




