from rest_framework import serializers

from account.models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    initials = serializers.CharField()

    class Meta:
        model = CustomUser
        fields = ('initials', 'first_name', 'last_name', 
                 'avatar_url', 'id', 'email', 'logged_in', 'color',
                  )
