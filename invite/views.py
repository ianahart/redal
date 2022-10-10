from rest_framework.exceptions import NotFound, ParseError, PermissionDenied
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from account.permissions import AccountPermission
from invite.serializers import InviteCreateSerializer, InviteSerializer
from invite.models import Invite



class DetailsAPIView(APIView):
    permission_classes = [IsAuthenticated, AccountPermission, ]

    def delete(self, request, pk: int):
        try:
            invite = Invite.objects.get(pk=pk)
            self.check_object_permissions(request, invite.receiver)

            invite.delete()
            return Response({
                                'message': 'success'
                            }, status=status.HTTP_200_OK)

        except PermissionDenied as e:
            return Response({
                                'error': e.detail
                            }, status=status.HTTP_403_FORBIDDEN)






class ListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request):
        try:

            invites = Invite.objects.retreive_all(request.user.id)
            serializer = InviteSerializer(invites, many=True) 


            return Response({
                                'message': 'success',
                                'invites': serializer.data,
                            },status=status.HTTP_200_OK)

        except NotFound as e:
            return Response({
                                'error': e.detail,
                            },status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        try:
            create_serializer = InviteCreateSerializer(data=request.data)
            create_serializer.is_valid(raise_exception=True)
            result = Invite.objects.create(create_serializer.validated_data)


            if result and result['type'] == 'error':
               raise ParseError(result['msg'])

            return Response({
                                'message': 'success',
                            }, status=status.HTTP_201_CREATED)


        except ParseError as e:
            print(e)
            return Response({
                                'error': e.detail
                            }, status=status.HTTP_400_BAD_REQUEST)




