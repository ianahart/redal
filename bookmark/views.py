from rest_framework.exceptions import NotFound, ParseError, PermissionDenied
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from account.permissions import AccountPermission
from bookmark.models import Bookmark
from bookmark.serializers import BookmarkCreateSerialzier, BookmarkSerializer


class DetailsAPIView(APIView):
    def delete(self, request, pk: int):
        try:
            bookmark = Bookmark.objects.get(pk=pk)
            if bookmark is not None:
                self.check_object_permissions(request, bookmark.user)
                bookmark.delete()

            return Response({
                                'message':'success'
                            }, status=status.HTTP_200_OK)
        except PermissionDenied:
            return Response({
                                'error': 'Do not have necessary authorization.'
                            }, status=status.HTTP_403_FORBIDDEN)





class DeleteBookmarkAPIView(APIView):
    permission_classes = [IsAuthenticated, AccountPermission, ]
   
    def delete(self, request, post_id: int):
        try:
            user_id = request.query_params['user_id']
            bookmark = Bookmark.objects.filter(post_id=post_id).filter(
                user_id=user_id).first()
            if bookmark is not None:
                self.check_object_permissions(request, bookmark.user)
                bookmark.delete()

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
            if 'page' not in request.query_params:
                raise NotFound('Missing a query paramter page.')

            result = Bookmark.objects.retrieve_bookmarks(
                request.query_params['page'],
                request.user.id
            )
            if result:
                serializer = BookmarkSerializer(result['bookmarks'], many=True)
                return Response({
                                    'message': 'success',
                                    'has_next': result['has_next'],
                                    'page': result['page'],
                                    'bookmarks': serializer.data
                                }, status=status.HTTP_200_OK)


        except NotFound:
            return Response({
                                'error': 'You currently do not have any bookmarks.'
                            }, status=status.HTTP_404_NOT_FOUND)


    def post(self, request):
        try:
            serializer = BookmarkCreateSerialzier(data=request.data)
            serializer.is_valid(raise_exception=True)
            user, post = serializer.validated_data.values()

            Bookmark.objects.create(user, post)

            return Response({
                                'message': 'success',
                            }, status=status.HTTP_200_OK)

        except ParseError:
            return Response({
                                'error': 'Could not not save post'
                            }, status=status.HTTP_400_BAD_REQUEST)



