from django.contrib import admin
from django.urls import path, include



urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/v1/', include(('authentication.urls', 'authentication'))),
    path('api/v1/', include(('account.urls', 'account'))),
    path('api/v1/', include(('community.urls', 'community'))),
    path('api/v1/', include(('post.urls', 'post'))),
    path('api/v1/', include(('member.urls', 'member'))),
    path('api/v1/', include(('upvote.urls', 'upvote'))),
    path('api/v1/', include(('comment.urls', 'comment'))),
    path('api/v1/', include(('bookmark.urls', 'bookmark'))),
    path('api/v1/', include(('notification.urls', 'notification'))),



]
