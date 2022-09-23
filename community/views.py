from django.shortcuts import render

from django.core.exceptions import BadRequest, ObjectDoesNotExist
from django.db import DatabaseError
from django.contrib.auth.hashers import check_password
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.exceptions import ParseError
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import FormParser, MultiPartParser
from community.models import Community
from community.serializers import CreateCommunitySerializer, FileSerializer
import json


class CreateCommunityAPIView(APIView):
    permission_classes = [IsAuthenticated, ]
    parser_classes = [ MultiPartParser, FormParser, ]

    def post(self, request):
       try:

            form_serializer = CreateCommunitySerializer(data=json.loads(request.data['form']))
            form_serializer.is_valid(raise_exception=True)
            name, type, user = form_serializer.validated_data.values()

            file_serializer = FileSerializer(data=request.data)
            file_serializer.is_valid(raise_exception=True)
            file = file_serializer.validated_data['file']

            Community.objects.create(file, user, name, type)

            return Response({
                                'message': 'success',
                            }, status=status.HTTP_200_OK)
       except ParseError:
            return Response({
                                'error': 'Unable to create your community, please review your fields.'
                            }, status=status.HTTP_400_BAD_REQUEST)

