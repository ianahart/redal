from typing import Any, Dict
from django.db.models import Q
from django.db import models
from django.core.paginator import Paginator
from django.utils import timezone
import logging
logger = logging.getLogger('django')


class FriendRequestManager(models.Manager):
    def get_friend_requests(self, user_id: int, page: int):
        objects = FriendRequest.objects.all().filter(to_user=user_id)
        paginator = Paginator(objects, 2)
        next_page = int(page) + 1
        cur_page = paginator.page(next_page)

        return {
            'requests': cur_page.object_list,
            'has_next': cur_page.has_next(),
            'page': next_page,
        }



class FriendManager(models.Manager):

    def delete_friends(self, user: int, friend: int):

        friend_one = Friend.objects.filter(user_id=user).filter(friend_id=friend).first()
        friend_two = Friend.objects.filter(user_id=friend).filter(friend_id=user).first()

        if friend_one is not None:
            friend_one.delete()
        if friend_two is not None:  
            friend_two.delete()

    def create(self, data: Dict[str, Any]):

        is_friend = Friend.objects.filter(
            Q(user=data['user']) & Q(friend=data['friend']) |
            Q(user=data['friend']) & Q(friend=data['user'])).first()


        if is_friend: 
            return

        request_one = FriendRequest.objects.filter(from_user_id=data['user']).filter(to_user_id=data['friend']).first()
        request_two = FriendRequest.objects.filter(to_user_id=data['user']).filter(from_user_id=data['friend']).first()

        if request_one is not None:
            request_one.delete()
        if request_two is not None:
            request_two.delete()


        friend_one = self.model(
            user=data['user'],
            friend=data['friend'],
        )

        friend_one.save()

        friend_two = self.model(
            user=data['friend'],
            friend=data['user']
        )
        friend_two.save()




    def get_friends(self, user_id: int, page: int):
        objects = Friend.objects.all().filter(user_id=user_id)
        paginator = Paginator(objects, 1)
        next_page = int(page) + 1
        cur_page = paginator.page(next_page)

        return {
            'friends': cur_page.object_list,
            'has_next': cur_page.has_next(),
            'page': next_page,
        }




class FriendRequest(models.Model):

    objects: FriendRequestManager = FriendRequestManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    to_user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='friend_request_to_user'
    )

    from_user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='friend_request_from_user'
    )


class Friend(models.Model):

    objects: FriendManager = FriendManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='friend_user'
    )
    friend = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='friend_friend'
    )



