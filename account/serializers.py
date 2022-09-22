from rest_framework import serializers

from account.models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    initials = serializers.CharField()

    class Meta:
        model = CustomUser
        fields = ('initials', 'first_name', 'last_name', 
                 'avatar_url', 'id', 'email', 'logged_in', 'color',
                  'about', 'display_name'
                  )


class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('about', 'display_name', )

    def validate_display_name(self, value):
        if len(value) > 30:
            raise serializers.ValidationError('Display name must be under 30 characters.')
        return value

    def validate_about(self, value):
        if len(value) > 200:
            raise serializers.ValidationError('Display name must be under 30 characters.')
 
        return value

class FileSerializer(serializers.Serializer):
    file = serializers.ImageField(required=False)

    class Meta:
        model = CustomUser
        fields = ('file', )

    def validate_file(self, file):
        if file.size > 1000000:
            raise serializers.ValidationError('Photo must be under 1MB.')
        return file
