from django.contrib.auth.models import User
from rest_framework import serializers
from account.serializers import UserSerializer

from comment.models import Comment
from like.serializers import LikeSerializer

class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('user', 'author', 'post', 'text', )




class CommentMinSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    readable_date = serializers.CharField()
    like_id = serializers.IntegerField()
    like_count = serializers.IntegerField()
    class Meta:
        model = Comment
        fields = ('user', 'text', 'id', 'readable_date', 'like_id', 'like_count', )



class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    author = UserSerializer()
    class Meta:
        model = Comment
        fields = ('user', 'text', 'author', 'id', )
