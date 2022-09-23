from rest_framework import serializers

from community.models import Community

class CreateCommunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Community
        fields = ('name', 'type', 'user', )

    def validate_name(self, name: str):
        if len(name) == 0 or len(name) > 200:
            raise serializers.ValidationError('Community name must be between 1 and 200 characters.')

        return name


    def validate_type(self, type: str):
        if len(type) == 0:
            raise serializers.ValidationError('Please provide a community type.')
        return type


class FileSerializer(serializers.Serializer):
    file = serializers.ImageField()

    class Meta:
        model = Community
        fields = ('file', )

    def validate_file(self, file):
        if file.size > 1000000:
            raise serializers.ValidationError('Photo must be under 1MB.')
        return file

