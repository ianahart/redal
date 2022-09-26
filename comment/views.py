from rest_framework.exceptions import NotFound, ParseError
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated





class ListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        try:
            return Response({
                                'message': 'success',
                            }, status=status.HTTP_200_OK)

        except ParseError:
            return Response({
                                'error': 'Could not create comment'
                            }, status=status.HTTP_400_BAD_REQUEST)



