from rest_framework.exceptions import NotFound, ParseError
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import FormParser, MultiPartParser
from post.models import Post
from services.file_upload import FileUpload
from account.permissions import AccountPermission
from post.serializers import FileSerializer, PostCreateSerializer, PostSerializer, PostsSerializer


class DetailsAPIView(APIView):
    permission_classes = [IsAuthenticated, AccountPermission, ]

    def get(self, request, pk: int):
        try:
            posts = Post.objects.retrieve_post(pk, request.user.id)

            if len(posts) == 0: #type:ignore
                raise NotFound('Post not found or is no longer available.')

            if posts:
                serializer = PostSerializer(posts[0])
                return Response({
                                    'message': 'success',
                                    'post': serializer.data,
                                }, status=status.HTTP_200_OK)
        except NotFound as e:
            return Response({
                                'error': e.detail
                            }, status=status.HTTP_404_NOT_FOUND)

class CreatePhotoAPIView(APIView):
    def post(self ,request):
        try:
            serializer = FileSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            aws = FileUpload(serializer.validated_data['file'], 'posts')
            url, filename = aws.upload()

            return Response({
                                'message': 'success',
                                    'url': url,
                            }, status=status.HTTP_200_OK)

        except ParseError:
            return Response({
                                'error': 'Unable to upload photo.'
                            }, status=status.HTTP_400_BAD_REQUEST)


class ListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, ]


    def get(self, request):
        try:
            params = request.query_params
            if 'sort' not in params or 'page' not in params:
                raise NotFound('Unable to load posts right now.')
            sort, page, id, = request.query_params.values()

            result = Post.objects.retrieve_posts(sort, page, id, request.user.id)
            if result:
                serializer = PostsSerializer(result['posts'], many=True)
                return Response({
                                    'message': 'success',
                                    'has_next': result['has_next'],
                                    'page': result['page'],
                                    'posts': serializer.data
                                }, status=status.HTTP_200_OK)

            else:
                raise NotFound('Something went wrong getting posts.')
        except NotFound as e:
            return Response({
                                'error': e.detail,
                            }, status=status.HTTP_404_NOT_FOUND)


    def post(self, request):
        serializer = PostCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        Post.objects.create(serializer.validated_data)



        try:
            return Response({
                                'message': 'success',
                            }, status=status.HTTP_200_OK)

        except NotFound:
            return Response({
                                'error': 'No communities found.'
                            }, status=status.HTTP_404_NOT_FOUND)

