from rest_framework.exceptions import NotFound, ParseError, PermissionDenied
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from comment.models import Comment
from comment.serializers import CommentMinSerializer
from account.permissions import AccountPermission




 
class DetailsAPIView(APIView):
    permission_classes = [IsAuthenticated, AccountPermission, ]

    def delete(self, request, pk: int):
        try:
            comment = Comment.objects.get(pk=pk)
            self.check_object_permissions(request, comment.user)
            comment.delete()


            return Response({
                                'message': 'success'
                            }, status=status.HTTP_200_OK)

        except PermissionDenied:
            return Response({
                                'error': 'You do not have authorization for this action.'
                            }, status=status.HTTP_403_FORBIDDEN)

class ListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request):
        try:
            page, sort, post_id = request.query_params.values()
            result = Comment.objects.retrieve_comments(page, sort, post_id, request.user.id)

            if result:
                serializer = CommentMinSerializer(result['comments'], many=True)
                return Response({
                                    'message': 'success',
                                    'has_next': result['has_next'],
                                    'page': result['page'],
                                    'comments': serializer.data
                                }, status=status.HTTP_200_OK)


        except NotFound:
            return Response({
                                'error': 'No Comments found for this post.'
                            }, status=status.HTTP_404_NOT_FOUND)



    def post(self, request):
        try:
            return Response({
                                'message': 'success',
                            }, status=status.HTTP_200_OK)

        except ParseError:
            return Response({
                                'error': 'Could not create comment'
                            }, status=status.HTTP_400_BAD_REQUEST)



