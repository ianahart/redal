from rest_framework import serializers

from upvote.models import UpVote

class UpVoteCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UpVote
        fields = ('post', 'user', 'action', )
