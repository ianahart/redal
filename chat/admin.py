from django.contrib import admin

from chat.models import Group, Message

admin.site.register(Group)
admin.site.register(Message)
