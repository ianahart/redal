from rest_framework.exceptions import ParseError, ValidationError
from django.core.exceptions import BadRequest, ObjectDoesNotExist
from rest_framework.decorators import permission_classes
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from account.models import CustomUser
from account.serializers import UserSerializer
from authentication.serializers import LogoutSerializer, RegisterSerializer, LoginSerializer
import json
import logging

from setting.models import Setting
logger = logging.getLogger('django')



class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        try:

            serializer = LogoutSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            CustomUser.objects.logout(
                serializer.validated_data['id'],
                serializer.validated_data['refresh_token']
            )

            return Response({
                                'message': 'success'
                            }, status=status.HTTP_200_OK)

        except ParseError:
            return Response({
                                'error': 'Unable to log you out right now.'
                            }, status=status.HTTP_400_BAD_REQUEST)


class TokenObtainPairView(APIView):
    def post(self, request):
        try:
            create_serializer = LoginSerializer(data=request.data)
            create_serializer.is_valid(raise_exception=True)
            result = CustomUser.objects.login(
                create_serializer.validated_data['email'],
                create_serializer.validated_data['password']
            )

            if 'type' in result and result['type'] == 'error':
                raise ParseError(result['msg'])


            user_serializer = UserSerializer(result['user'])
            print(user_serializer.data)

            return Response({
                            'message': 'success',
                            'tokens': result['tokens'],
                            'user': user_serializer.data
                            }, status=status.HTTP_200_OK)

        except ParseError as e:
            return Response({
                            'email': [e.detail]
                            }, status=status.HTTP_400_BAD_REQUEST)

class RegisterAPIView(APIView):
    """
       A View for creating/registering a user.
    """
    permission_classes = [AllowAny, ]

    def post(self, request):
        try:
            serializer = RegisterSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            exclude = ['email', 'password', 'confirm_password']
            extra_fields = {key:value for key, value in serializer.validated_data.items() if key not in exclude}
            user = CustomUser.objects.create(serializer.validated_data['email'],
                                      serializer.validated_data['password'],
                                      **extra_fields
                                      )
            if user:
               Setting.objects.create(user)
            return Response({
                'message': 'success'
            }, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({
                'errors': e.detail
                            }, status=status.HTTP_400_BAD_REQUEST)


