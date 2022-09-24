from django.shortcuts import render

from django.core.exceptions import BadRequest, ObjectDoesNotExist
from django.db import DatabaseError
from django.contrib.auth.hashers import check_password
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.exceptions import NotFound, ParseError
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import FormParser, MultiPartParser
from post.models import Post
from services.file_upload import FileUpload
from post.serializers import FileSerializer, PostCreateSerializer
import json



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

