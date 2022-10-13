from rest_framework import serializers
from account.serializers import UserSerializer

from chat.models import Group, Message



class MessageExcludeSerializer(serializers.Serializer):
    exclude = serializers.ListField()
    class Meta:
        fields = ('exclude', )

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'user_one', 'user_two', )

class GroupCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('user_one', 'user_two', )

class MessageUserSerializer(serializers.ModelSerializer):

    class Meta:
       model = Message
       fields = ('user', 'group', 'text', )


class MessageSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Message
        fields = ('user', 'text', 'id', )
