from botocore import serialize
from rest_framework.exceptions import NotFound, ParseError, PermissionDenied
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from account.permissions import AccountPermission
from community.serializers import CommunitySerializer
from private.serializers import PrivateCreateSerializer
from private.models import Private
from member.models import Member




class ListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        try:
            create_serializer = PrivateCreateSerializer(data=request.data)
            create_serializer.is_valid(raise_exception=True)
            result = Private.objects.create(create_serializer.validated_data)

            serializer = CommunitySerializer(create_serializer.validated_data['community'])


            Member.objects.create(
                create_serializer.validated_data['community'],
                create_serializer.validated_data['user'],
            )

            if result and result['type'] == 'error':
               raise ParseError(result['msg'])

            return Response({
                                'message': 'success',
                                'community': serializer.data
                            }, status=status.HTTP_201_CREATED)


        except ParseError as e:
            return Response({
                                'error': e.detail
                            }, status=status.HTTP_400_BAD_REQUEST)





