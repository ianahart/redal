from django.db import models
from django.core.paginator import Paginator
from django.utils import timezone
from typing import Any, Dict
from django.db import  DatabaseError, models
from services.file_upload import FileUpload
import random
import logging
import time
import base64
import datetime
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
       except DatabaseError:
            logger.error('Unable to create a community post.')


    def retrieve_posts(self, sort: str, page: int, community_id):
        try:
            result = None
            match sort:
                case 'new':
                    result = self.__get_new(sort, page, community_id)

                case 'hot':
                    result = self.__get_hot(sort, page, community_id)

                case 'top':
                    result = self.__get_top(sort, page, community_id)

                case other:
                   result = self.__get_new('new', 0, community_id)

            return result
        except DatabaseError:
            logger.error('Unable to retrieve posts for this community.')



    def __get_display_date(self, timestamp: int):
        today = round(time.time())
        time_elapsed = today - timestamp
        display_date = ''

        if time_elapsed < 60:
            display_date = f'{time_elapsed} seconds ago'
        elif time_elapsed < 3600 and time_elapsed > 60:
            minutes = round(time_elapsed / 60)
            display_date = f'{minutes} minutes ago'
        elif time_elapsed > 3600 and time_elapsed < 86400:
            hours = round(time_elapsed / 3600)
            display_date = f'{hours} hours ago'
        elif time_elapsed > 86400:
            days = round(time_elapsed / 86400)
            display_date = f'{days} days ago'

        return display_date


    def __add_foreign_fields(self, objects):
            for object in objects:
                if object.user.display_name:
                    object.name = object.user.display_name
                else:
                    object.name = object.user.first_name + ' ' + object.user.last_name
                object.display_date = self.__get_display_date(
                                  round(object.created_at.timestamp()))
                object.comment_count = object.comment_post.count()
                object.upvote_count = object.upvote_post.count()


    def __get_new(self, sort: str, page: int, community_id):
        try:
            objects = Post.objects.all().order_by('-id').filter(community_id=community_id)

            self.__add_foreign_fields(objects)

            paginator = Paginator(objects, 3)
            next_page = int(page) + 1
            cur_page = paginator.page(next_page)

            return {
                'posts': cur_page.object_list,
                'has_next': cur_page.has_next(),
                'page': next_page,
            }


        except DatabaseError:
            logger.error('Unable to retrieve new posts.')
            return {
                'posts': [],
                'has_next': False,
                'page': 0,
            }



    def __get_hot(self, sort: str, page: int, community_id):
        try:
            print('get hot')
        except DatabaseError:
            logger.error('Unable to retrieve hot posts.')


    def __get_top(self,sort: str, page: int, community_id):
        try:
            print('get top')
        except DatabaseError:
            logger.error('Unable to retrieve top posts.')

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


