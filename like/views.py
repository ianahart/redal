from rest_framework.exceptions import NotFound, ParseError, PermissionDenied
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from account.permissions import AccountPermission
from like.models import Like
from like.serializers import LikeCreateSerializer, LikeSerializer



class DetailsAPIView(APIView):
    permission_classes = [IsAuthenticated, AccountPermission, ]

    def delete(self, request, pk: int):
        try:

            like = Like.objects.get(pk=pk)

            self.check_object_permissions(request, like.user)

            like.delete()

            return Response({
                                'message': 'success'
                            }, status=status.HTTP_200_OK)


        except PermissionDenied:
            return Response({
                                'error': 'Unable to unlike comment.'
                            }, status=status.HTTP_403_FORBIDDEN)

class ListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, ]
    def post(self, request):
        try:
            create_serializer = LikeCreateSerializer(data=request.data)
            create_serializer.is_valid(raise_exception=True)

            like = Like.objects.create(
                      create_serializer.validated_data,
                                request.user)


            serializer = LikeSerializer(like)

            return Response({
                                'message': 'success',
                                'like': serializer.data,
                            }, status=status.HTTP_201_CREATED)


        except ParseError:
            return Response({
                                'error': 'Unable to like/unlike comment.'
                            }, status=status.HTTP_400_BAD_REQUEST)



