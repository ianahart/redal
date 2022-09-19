from rest_framework.exceptions import ValidationError
from django.core.exceptions import BadRequest, ObjectDoesNotExist
from rest_framework.decorators import permission_classes
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from account.models import CustomUser
from authentication.serializers import RegisterSerializer
import json
import logging
logger = logging.getLogger('django')


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
            CustomUser.objects.create(serializer.validated_data['email'],
                                      serializer.validated_data['password'],
                                      **extra_fields
                                      )

            return Response({
                'message': 'success'
            }, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({
                'errors': e.detail
                            }, status=status.HTTP_400_BAD_REQUEST)


