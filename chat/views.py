from rest_framework.exceptions import NotFound, ParseError, PermissionDenied
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from account.permissions import AccountPermission
from chat.models import Group, Message
from chat.serializers import GroupCreateSerializer, GroupSerializer, MessageExcludeSerializer, MessageSerializer




class MessageListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        try:

            group_id, page = request.query_params.values()
            exclude_serializer = MessageExcludeSerializer(data=request.data)
            exclude_serializer.is_valid()
            result = Message.objects.retrieve_messages(group_id, page, exclude_serializer.validated_data)
            if result:
                serializer = MessageSerializer(result['messages'], many=True)
                return Response({
                                'message': 'success',
                                'has_next': result['has_next'],
                                'page': result['page'],
                                'messages': serializer.data
                            }, status=status.HTTP_200_OK)
        except NotFound:
            return Response({
                                'error': 'No messages found'
                            }, status.HTTP_404_NOT_FOUND)





class GroupDetailsAPIView(APIView):
    permission_classes = [IsAuthenticated, AccountPermission, ]

    def delete(self, request, pk: int):
        try:

            group = Group.objects.get(pk=pk)

            self.check_object_permissions(request, group.user)

            group.delete()

            return Response({
                                'message': 'success'
                            }, status=status.HTTP_200_OK)


        except PermissionDenied:
            return Response({
                                'error': 'Unable to unlike comment.'
                            }, status=status.HTTP_403_FORBIDDEN)

class GroupListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, ]
    def post(self, request):
        try:

            create_serializer = GroupCreateSerializer(data=request.data)

            create_serializer.is_valid()
            result = Group.objects.create(create_serializer.validated_data)
            serializer = GroupSerializer(result)


            return Response({
                                'message': 'success',
                                'group': serializer.data,
                            }, status=status.HTTP_201_CREATED)


        except ParseError:
            return Response({
                                'error': 'Unable to like/unlike comment.'
                            }, status=status.HTTP_400_BAD_REQUEST)




