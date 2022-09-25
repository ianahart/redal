from django.db import DatabaseError, models
from django.utils import timezone
import logging

logger = logging.getLogger('django')

class MemberManager(models.Manager):




    def get_by_community(self, user_id: int, community_id: int):
        try:
           return Member.objects.all().filter(
                user_id=user_id).filter(
                community_id=community_id).first()

        except DatabaseError:
            logger.error('Unable to retrieve member by community id')
            return None


    def is_member(self, community_id: int, user_id: int):
        try:
            member = Member.objects.all().filter(
                community_id=community_id).filter(
                user_id=user_id).only('id').first()

            return True if member else False

        except DatabaseError:
            return False
            logger.error('Unable to determine if user is_member of a community.')


    def create(self, community, user):
        try:
            member = self.model(community=community, user=user)

            member.save()
        except DatabaseError as e:
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

