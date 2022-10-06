from django.db import DatabaseError, models
from django.utils import timezone
from account.models import CustomUser
from django.core.paginator import Paginator
from comment.models import Comment
import logging
logger = logging.getLogger('django')

class NotificationManager(models.Manager):


    def fetch_notifications(self, page: int, user_id: int):
        try:
            objects = Notification.objects.all().order_by('-id').filter(user_id=user_id)
            paginator = Paginator(objects, 3)
            next_page = int(page) + 1
            cur_page = paginator.page(next_page)

            return {
                'notifications': cur_page.object_list,
                'has_next': cur_page.has_next(),
                'page': next_page,
            }


        except DatabaseError:
            logger.error('Unable to retrieve notifications.')
            return {
                'notifications': [],
                'has_next': False,
                'page': 0,
            }



    def create(self, comment):
        try:
            text = None
            if comment.user.display_name:
                text = f'{comment.user.display_name} commented on your post, {comment.post.title}'
            else:
                text = f'{comment.user.first_name} {comment.user.last_name} commented on a post titled f{comment.post.title}'
            notification = self.model(

                comment=comment,
                user=comment.author,
                avatar_url=comment.user.avatar_url,
                text=text
            )

            notification.save()
        except DatabaseError:
            logger.error('Unable to create a notification for a comment.')



class Notification(models.Model):

    objects: NotificationManager = NotificationManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    text = models.CharField(max_length=100)
    avatar_url = models.URLField(blank=True, null=True)
    comment = models.ForeignKey(
    'comment.Comment',
    on_delete=models.CASCADE,
    related_name='notification_comments'
)
    user = models.ForeignKey(
    'account.CustomUser',
    on_delete=models.CASCADE,
    related_name='notification_user'
)
