from rest_framework import serializers

from bookmark.models import Bookmark
from post.serializers import PostMinSerializer


class BookmarkSerializer(serializers.ModelSerializer):
    post = PostMinSerializer()
    class Meta:
        model =Bookmark
        fields = ('id', 'post', )

class BookmarkCreateSerialzier(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = ('user', 'post', )
