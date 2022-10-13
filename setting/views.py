from rest_framework.exceptions import NotFound, ParseError, PermissionDenied
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from account.permissions import AccountPermission
from setting.models import Setting
from setting.serializers import SettingUpdateNotificationsSerializer, SettingUpdateMessagesSerializer



class DetailsMessageAPIView(APIView):
    permission_classes = [IsAuthenticated, AccountPermission, ]
    
    def patch(self, request, pk: int):
        try:
            setting = Setting.objects.get(pk=pk)
            self.check_object_permissions(request, setting.user)
            serializer = SettingUpdateMessagesSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            Setting.objects.update_messages(serializer._validated_data, pk)


            return Response({
                                'message':'success'
                            }, status=status.HTTP_200_OK)
        except PermissionDenied:
            return Response({
                                'error': 'Do not have necessary authorization.'
                            }, status=status.HTTP_403_FORBIDDEN)





class DetailsNotificationAPIView(APIView):
    permission_classes = [IsAuthenticated, AccountPermission, ]
    
    def patch(self, request, pk: int):
        try:
            setting = Setting.objects.get(pk=pk)
            self.check_object_permissions(request, setting.user)
            serializer = SettingUpdateNotificationsSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            Setting.objects.update_notifications(serializer._validated_data, pk)


            return Response({
                                'message':'success'
                            }, status=status.HTTP_200_OK)
        except PermissionDenied:
            return Response({
                                'error': 'Do not have necessary authorization.'
                            }, status=status.HTTP_403_FORBIDDEN)



class ListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        try:

            return Response({
                                'message': 'success',
                            }, status=status.HTTP_200_OK)

        except ParseError:
            return Response({
                                'error': 'Could not create upvote'
                            }, status=status.HTTP_400_BAD_REQUEST)



