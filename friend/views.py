from rest_framework.exceptions import NotFound, ParseError, PermissionDenied
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from account.permissions import AccountPermission
from friend.models import Friend, FriendRequest
from friend.serializers import FriendCreateSerializer, FriendRequestCreateSerializer, FriendRequestSerializer, FriendSerializer


class FriendDetailsAPIView(APIView):

    def delete(self, request, id: int):
        try:
             friend = Friend.objects.get(pk=id)
             self.check_object_permissions(request, friend.user)
             user, friend = request.query_params.values()
             Friend.objects.delete_friends(user, friend)

             return Response({
                                'message': 'success',
                            }, status=status.HTTP_200_OK)
        except PermissionDenied:
            return Response({
                                'error': 'You do not have proper authorization for this action.'
                            }, status=status.HTTP_403_FORBIDDEN)




    def get(self, request, id: int):
       try:

            result = Friend.objects.get_friends(id, request.query_params['page'])

            serializer = FriendSerializer(result['friends'], many=True)

            return Response({
                        'message': 'success',
                        'has_next': result['has_next'],
                        'page': result['page'],
                        'friends':serializer.data,
                            }, status=status.HTTP_200_OK)

       except NotFound:
            return Response({
                                'error': 'You currently do not have any friend requests.'
                            }, status=status.HTTP_404_NOT_FOUND)



class FriendListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        try:
            create_serializer = FriendCreateSerializer(data=request.data)
            create_serializer.is_valid()
            Friend.objects.create(create_serializer.validated_data)


            return Response({
                                'message': 'success',
                            }, status=status.HTTP_200_OK)
        except ParseError:
            return Response({
                                'error': 'Unable to accept friend request'
                            }, status=status.HTTP_400_BAD_REQUEST)

class RequestDetailsAPIView(APIView):
    permission_classes = [IsAuthenticated, AccountPermission, ]


    def delete(self, request, id: int):
        try:
            friend_request = FriendRequest.objects.get(pk=id)
            self.check_object_permissions(request, friend_request.to_user)
            friend_request.delete()

            return Response({
                                'message':'success'
                            }, status=status.HTTP_200_OK)

        except PermissionDenied:
            return Response({
                                'error': 'You do not have permission to delete this item.'
                            }, status.HTTP_403_FORBIDDEN)




    def get(self, request, id: int):
       try:

            result = FriendRequest.objects.get_friend_requests(id, request.query_params['page'])

            serializer = FriendRequestSerializer(result['requests'], many=True)

            return Response({
                        'message': 'success',
                        'has_next': result['has_next'],
                        'page': result['page'],
                        'requests': serializer.data,
                            }, status=status.HTTP_200_OK)

       except NotFound:
            return Response({
                                'error': 'You currently do not have any friend requests.'
                            }, status=status.HTTP_404_NOT_FOUND)

class RequestListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        try:
            create_serializer = FriendRequestCreateSerializer(data=request.data)
            create_serializer.is_valid()
            FriendRequest.objects.create(**create_serializer.validated_data)
            return Response({
                                'message': 'success'
                            }, status=status.HTTP_201_CREATED)


        except ParseError as e:
            return Response({
                                'error': e.detail,
                            }, status=status.HTTP_400_BAD_REQUEST)


