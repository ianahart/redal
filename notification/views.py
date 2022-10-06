from rest_framework.exceptions import NotFound, ParseError, PermissionDenied
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from account.permissions import AccountPermission
from notification.models import Notification
from notification.serializers import NotificationSerializer




class DetailsAPIView(APIView):
    permission_classes = [IsAuthenticated, AccountPermission, ]
    
    def delete(self, request, pk: int):
        try:
            notification = Notification.objects.get(pk=pk)
            self.check_object_permissions(request, notification.user)
            notification.delete()

            return Response({
                                'message':'success'
                            }, status=status.HTTP_200_OK)
        except PermissionDenied:
            return Response({
                                'error': 'Do not have necessary authorization.'
                            }, status=status.HTTP_403_FORBIDDEN)



class ListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request):
        try:

            result = Notification.objects.fetch_notifications(
                request.query_params['page'],
                request.user.id)

            notifications_count = Notification.objects.all().filter(
                user_id=request.user.id).count()

            if result:
                serializer = NotificationSerializer(result['notifications'], many=True)
                return Response({
                                    'message': 'success',
                                    'has_next': result['has_next'],
                                    'page': result['page'],
                                    'notifications': serializer.data,
                                    'notifications_count': notifications_count
                                }, status=status.HTTP_200_OK)



            return Response({
                                'message': 'success'
                            }, status=status.HTTP_200_OK)

        except NotFound: 
            return Response({
                                'error': 'Unable to retrieve notifications.'
                            }, status=status.HTTP_404_NOT_FOUND)
