from django.db import models
from django.core.paginator import Paginator
from django.utils import timezone
from typing import Any, Dict, Union
from django.db import  DatabaseError, models
import random
import logging
import base64
logger = logging.getLogger('django')

class CommentManager(models.Manager):

     def get_old(self, page: int, sort: str, post_id):
        try:
            objects = Comment.objects.all().order_by('id').filter(post_id=post_id)
            paginator = Paginator(objects, 3)
            next_page = int(page) + 1
            cur_page = paginator.page(next_page)

            return {
                'comments': cur_page.object_list,
                'has_next': cur_page.has_next(),
                'page': next_page,
            }


        except DatabaseError:
            logger.error('Unable to retrieve comments for a post.')
            return {
                'comments': [],
                'has_next': False,
                'page': 0,
            }



     def create_readable_dates(self, objects):
        for object in objects:
            object.readable_date = object.created_at.strftime('%m/%d/%Y')

     def get_new(self, page: int, sort: str, post_id):
        try:
            objects = Comment.objects.all().order_by('-id').filter(post_id=post_id)
            self.create_readable_dates(objects)
            paginator = Paginator(objects, 3)
            next_page = int(page) + 1
            cur_page = paginator.page(next_page)


            return {
                'comments': cur_page.object_list,
                'has_next': cur_page.has_next(),
                'page': next_page,
            }


        except DatabaseError:
            logger.error('Unable to retrieve comments for a post.')
            return {
                'comments': [],
                'has_next': False,
                'page': 0,
            }



     def retrieve_comments(self, page: int, sort: str, post_id):
        result = None
        match sort:
            case 'new':
                result = self.get_new(page, sort, post_id)
            case 'new':
                result = self.get_old(page, sort, post_id)
            case other:
                result = self.get_new(page, sort, post_id)

        return result

     def create(self, data):
       try:
            comment = self.model(
                text=data['text'],
                author=data['author'],
                user=data['user'],
                post=data['post']
            )

            comment.save()
            comment.refresh_from_db()

            return comment
       except DatabaseError:
            logger.error('Unable to create a comment.')



class Comment(models.Model):


    objects: CommentManager = CommentManager()


    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    text = models.CharField(max_length=100, blank=True, null=True)
    author = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='comment_author',
        blank=True, null=True

    )

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




