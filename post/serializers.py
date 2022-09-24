from rest_framework import serializers

from post.models import Post

class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('community', 'user', 'title',
                  'avatar_url', 'initials', 'post'
                  )


class FileSerializer(serializers.Serializer):
    file = serializers.ImageField(required=False)

    class Meta:
        model = Post
        fields = ('file', )

    def validate_file(self, file):
        if file.size > 1000000:
            raise serializers.ValidationError('Photo must be under 1MB.')
        return file

