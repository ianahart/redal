from django.shortcuts import render

from django.core.exceptions import BadRequest, ObjectDoesNotExist
from django.db import DatabaseError
from django.contrib.auth.hashers import check_password
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.exceptions import ParseError
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from account.permissions import AccountPermission
from account.models import CustomUser
from account.serializers import UpdateUserSerializer, UserSerializer, FileSerializer
import json


class RetreiveUserAPIView(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request):
        try:
            user = CustomUser.objects.user_by_token(
                request.user,
                request.headers['authorization'])
            serializer = UserSerializer(user)
            return Response({
                'message': 'success',
                'user': serializer.data
            }, status=status.HTTP_200_OK)
        except BadRequest as e:
            return Response({
                            'errors': 'Something went wrong.'
                            }, status=status.HTTP_400_BAD_REQUEST)







class DetailsAPIView(APIView):
    permission_classes = [IsAuthenticated, AccountPermission]
    parser_classes = [ MultiPartParser, FormParser, ]

    def patch(self, request, pk: int):
        try:
            form_serializer = UpdateUserSerializer(data=json.loads(request.data['form']))
            form_serializer.is_valid(raise_exception=True)

            file_serializer = FileSerializer(data=request.data)
            file_serializer.is_valid(raise_exception=True)


            req_user = CustomUser.objects.get(pk=pk)
            self.check_object_permissions(request, req_user)

            user = CustomUser.objects.update_profile(
                pk,
                form_serializer.validated_data,
                file_serializer.validated_data
            )

            user_serializer = UserSerializer(user)
            return Response({
                                'msg': 'success',
                                    'user': user_serializer.data,
                            }, status=status.HTTP_200_OK)

        except ParseError as e:
            print(e)
            return Response({
                                'error': 'Unable to save profile information.'
                            }, status=status.HTTP_400_BAD_REQUEST)




