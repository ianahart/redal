from rest_framework.exceptions import NotFound, ParseError, PermissionDenied
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from account.permissions import AccountPermission
from upvote.models import UpVote
from upvote.serializers import UpVoteCreateSerializer







class DetailsAPIView(APIView):
    permission_classes = [IsAuthenticated, AccountPermission, ]
    
    def delete(self, request, pk: int):
        try:
            upvote = UpVote.objects.get(pk=pk)
            self.check_object_permissions(request, upvote.user)
            upvote.delete()

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

            serializer = UpVoteCreateSerializer(data=request.data)

            serializer.is_valid(raise_exception=True)

            post, user,action = serializer.validated_data.values()

            UpVote.objects.create(post, user, action)
            return Response({
                                'message': 'success',
                            }, status=status.HTTP_200_OK)

        except ParseError:
            return Response({
                                'error': 'Could not create upvote'
                            }, status=status.HTTP_400_BAD_REQUEST)


