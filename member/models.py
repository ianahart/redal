from django.db import DatabaseError, models
from django.utils import timezone
import logging
from account.models import CustomUser

from community.models import Community
logger = logging.getLogger('django')

class MemberManager(models.Manager):
    def create(self, community: 'Community', user: 'CustomUser'):
        try:
            member = self.model(community=community, user=user)

            member.save()
        except DatabaseError as e:
            print(e)
            logger.error('Unable to create a member for a community.')



class Member(models.Model):

    objects: MemberManager = MemberManager()
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='member_user'
    )
    community = models.ForeignKey(
        'community.Community',
        on_delete=models.CASCADE,
        related_name='member_community'
    )

