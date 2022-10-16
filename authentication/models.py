from django.db import models
from django.utils import timezone
from datetime import datetime, timedelta

class PasswordResetManager(models.Manager):



     def reset_password(self, data: dict[str, str], user_id: int):
        token = PasswordReset.objects.all().filter(
            token=data['token']
        ).filter(user_id=user_id).first()

        if token is not None:
            inbetween = datetime.now(timezone.utc) - token.created_at
            if inbetween > timedelta(1):
                return {'type': 'error', 'error': 'The link has expired.'}

            if data['new_password'] != data['confirm_password']:
                return {'type': 'error', 'error': 'Passwords do not match.'}

            token.delete()
            return {'type': 'ok', 'new_password': data['new_password']}





     def create(self, data, user):
            prev_resets = PasswordReset.objects.all().filter(
                user_id=data['data']['uid'])

            for prev_reset in prev_resets:
                prev_reset.delete()

            password_reset = self.model(
                token=data['data']['token'],
                user=user
            )
            password_reset.save()

class PasswordReset(models.Model):

    objects: PasswordResetManager = PasswordResetManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    token = models.TextField(max_length=400)
    user = models.ForeignKey('account.CustomUser',
                             on_delete=models.CASCADE, related_name='password_reset')

    def __str__(self):
        return self.token
