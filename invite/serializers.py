from rest_framework import serializers

from invite.models import Invite
from account.serializers import UserSerializer
from community.serializers import CommunityInviteSerializer



class InviteCreateSerializer(serializers.ModelSerializer):
    value = serializers.CharField()
    class Meta:
        model = Invite
        fields = ('sender', 'community', 'value', )


class InviteSerializer(serializers.ModelSerializer):
    community = CommunityInviteSerializer(read_only=True)
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)
    class Meta:
        model = Invite
        fields = ('id', 'sender_id', 'community_id', 'community', 
                  'sender', 'receiver' )
