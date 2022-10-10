from rest_framework import serializers

from private.models import Private

class PrivateCreateSerializer(serializers.ModelSerializer):
    invite_id = serializers.IntegerField()
    class Meta:
        model = Private
        fields = ('user', 'community', 'invite_id', )
