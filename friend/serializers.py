from rest_framework import serializers
from account.serializers import UserSerializer

from friend.models import FriendRequest, Friend

class FriendCreateSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    class Meta:
        model = Friend
        fields = ('user', 'friend', 'id', )

class FriendRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = ('to_user', 'from_user', )



class FriendSerializer(serializers.ModelSerializer):
   friend = UserSerializer()
   messages_on = serializers.BooleanField()
   class Meta:
        model = Friend
        fields = ('friend', 'id', 'messages_on', )

class FriendRequestSerializer(serializers.ModelSerializer):

    to_user = UserSerializer()
    from_user = UserSerializer()

    class Meta:
        model = FriendRequest
        fields = ('to_user', 'from_user', 'id', )
