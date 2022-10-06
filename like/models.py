from typing import Any, Dict
from django.db import DatabaseError, models
from django.utils import timezone
import logging
logger = logging.getLogger('django')


class LikeManager(models.Manager):
    def create(self, data: Dict[str, Any], user):
        try:
            like = self.model(
                comment=data['comment'],
                user=user
            )
            like.save()

            like.refresh_from_db()
            return like

        except DatabaseError as e:
            logger.error('Unable to create a like.')
            print(e)




class Like(models.Model):

    objects: LikeManager = LikeManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='like_user'
    )
    comment = models.ForeignKey(
        'comment.Comment',
        on_delete=models.CASCADE,
        related_name='like_comment'
    )



