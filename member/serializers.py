from rest_framework import serializers

from member.models import Member


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ('id', 'community_id', 'user_id', )

class MemberCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ('user', 'community', )
