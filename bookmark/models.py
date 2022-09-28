from django.db import models
import logging
logger = logging.getLogger('django')
from django.utils import timezone

class BookmarkManager(models.Manager):
    def create(self, user, post):
        bookmark = self.model(
            user=user,
            post=post
        )

        bookmark.save()



class Bookmark(models.Model):

    objects: BookmarkManager = BookmarkManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='bookmark_user'
    )
    post = models.ForeignKey(
        'post.Post',
        on_delete=models.CASCADE,
        related_name='bookmark_posts'
    )

