from typing import Any, Dict
from django.db import DatabaseError, models
from django.db.models import Q
from django.core.paginator import Paginator
from django.utils import timezone
import logging
logger = logging.getLogger('django')


class MessageManager(models.Manager):


    def retrieve_messages(self, group_id: int, page: int, data: Dict[str, Any]):
        try:
            objects = Message.objects.all().filter(
                group_id=group_id
            ).exclude(id__in=data['exclude']).order_by('-id').distinct()
            paginator = Paginator(objects, 3)
            next_page = int(page) + 1
            cur_page = paginator.page(next_page)

            return {
                'messages': cur_page.object_list,
                'has_next': cur_page.has_next(),
                'page': next_page,
            }

        except DatabaseError:
            logger.error('Unable to retrieve messages.')

    def create(self, data):
        try:
            message = self.model(
                group=data['group'],
                user=data['user'],
                text=data['text']
            )
            message.save()
            message.refresh_from_db()

            return message
        except DatabaseError:
            logger.error('Unable to create message.')

class GroupManager(models.Manager):
    def create(self, data: Dict[str, Any]):
        user_one, user_two = data.values()
        group_exists = Group.objects.filter(
            Q(user_one=user_one) & Q(user_two=user_two) |
                            Q(user_one=user_two) & Q(user_two=user_one)
                             ).first()

        if group_exists is None:
            group = self.model(
                user_one=user_one,
                user_two=user_two
            )
            group.save()
            group.refresh_from_db()
            return group
        else:
            return group_exists



class Message(models.Model):

    objects: MessageManager = MessageManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    text = models.CharField(max_length=200)
    group = models.ForeignKey(
        'chat.Group',
        on_delete=models.CASCADE,
        related_name='group_messages'
    )
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='group_user'
    )



class Group(models.Model):

    objects: GroupManager = GroupManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    user_one = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='group_user_one'
    )
    user_two = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='group_user_two'
    )

