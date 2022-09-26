from rest_framework import serializers

from post.models import Post




class PostsSerializer(serializers.ModelSerializer):
    name = serializers.CharField()
    display_date = serializers.CharField()
    comment_count = serializers.IntegerField()
    upvote_count = serializers.IntegerField()
    user_upvoted = serializers.CharField()

    class Meta:
        model = Post
        fields = ('id', 'avatar_url', 'initials', 'upvote_count',
                  'title', 'name', 'display_date', 'comment_count',
                  'user_upvoted',
                  )


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

