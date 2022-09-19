from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm #type: ignore
from .models import CustomUser


class UserCreationForm(UserCreationForm):

    class Meta:
        model = CustomUser
        fields = ('email', )

        error_messages = {
            "email": {
                "unique": "A user with this email already exists."
            }
        }


class UserChangeForm(UserChangeForm):

    class Meta:
        model = CustomUser
        fields = ('email',)

