from rest_framework import serializers

from bookmark.models import Bookmark



class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model =Bookmark
        fields = ('id', )

class BookmarkCreateSerialzier(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = ('user', 'post', )
