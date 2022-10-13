from typing import Dict
from django.db import models
from django.utils import timezone
import logging

logger = logging.getLogger('django')

class SettingManager(models.Manager):
    def create(self, user):
        setting = self.model(user=user)
        setting.save()



    def update_messages(self, data: Dict[str, bool], pk: int):
        try:

            setting = Setting.objects.get(pk=pk)
            setting.messages_on = data['messages_on']
            setting.save()

        except:
            logger.error('Unable to update message settings.')





    def update_notifications(self, data: Dict[str, bool], pk: int):
        try:
            setting = Setting.objects.get(pk=pk)
            setting.notifications_on = data['notifications_on']
            setting.save()

        except:
            logger.error('Unable to update notification settings.')




class Setting(models.Model):

    objects: SettingManager = SettingManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    notifications_on = models.BooleanField(default=True) #type: ignore
    messages_on = models.BooleanField(default=True) #type:ignore
    user = models.OneToOneField(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='setting_user'
    )
