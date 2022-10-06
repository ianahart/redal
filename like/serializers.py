from rest_framework import serializers

from like.models import Like

class LikeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ('comment', )


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ('id' , 'comment', 'user', )
