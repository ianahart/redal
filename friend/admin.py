from django.contrib import admin

from friend.models import Friend, FriendRequest

admin.site.register(Friend)
admin.site.register(FriendRequest)
