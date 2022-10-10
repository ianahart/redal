from typing import Any, Dict
from django.db import DatabaseError, models
from django.utils import timezone

import logging

from account.models import CustomUser
logger = logging.getLogger('django')

class InviteManager(models.Manager):


    def retreive_all(self, user_id: int):
        try:
            objects = Invite.objects.filter(receiver_id=user_id)

            return objects
        except DatabaseError:
            logger.error('Unable to retreive invites.')



    def create(self, data: Dict[str, Any]):
        receiver = None
        if len(data['value'].split()) == 2:
            first_name, last_name = data['value'].split()
            receiver = CustomUser.objects.all().filter(
                first_name__iexact=first_name).filter(
                last_name__iexact=last_name).first()
        else:
            receiver = CustomUser.objects.all().filter(
                display_name__iexact=data['value']).first()

        if receiver is None:
            return {'type': 'error', 'msg': 'Could not find user.'}

        already_sent = Invite.objects.all().filter(
            community_id=data['community'].id).filter(
            receiver=receiver.id).first()

        if already_sent is not None:
            return {'type': 'error', 'msg': 'You have already sent out an invitation to this user'}

        invite = self.model(
            community=data['community'],
            sender=data['sender'],
            receiver=receiver,
        )
        invite.save()

        return {'type': 'ok', 'data': data['community']}

class Invite(models.Model):

    objects: InviteManager = InviteManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    community = models.ForeignKey(
         'community.Community',
         on_delete=models.CASCADE,
         related_name='invite_communities'
    )
    sender = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='invite_sender'
    )
    receiver = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='invite_receiver'
    )

