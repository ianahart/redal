from django.db import DatabaseError, models
from django.core.paginator import Paginator
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




    def retrieve_bookmarks(self, page: int, user_id: int):
        try:
            objects = Bookmark.objects.all().filter(user_id=user_id).order_by('-id')
            paginator = Paginator(objects, 3)
            next_page = int(page) + 1
            cur_page = paginator.page(next_page)

            return {
                'bookmarks': cur_page.object_list,
                'has_next': cur_page.has_next(),
                'page': next_page,
            }



        except DatabaseError:
            logger.error('Unable to retrieve a user\'s bookmarks.')
            return {
                'bookmarks': [],
                'has_next': False,
                'page': 0,
            }


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

