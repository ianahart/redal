from django.core.exceptions import BadRequest, ObjectDoesNotExist
from django.db import DatabaseError
from django.contrib.auth.hashers import check_password
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.exceptions import NotFound, ParseError, PermissionDenied
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import FormParser, MultiPartParser
from account.permissions import AccountPermission
from member.serializers import MemberCreateSerializer, MemberSerializer
from member.models import Member
from private.models import Private
import json



class DetailsAPIView(APIView):
    permission_classes = [IsAuthenticated, AccountPermission, ]

    def delete(self, request, pk: int):

        try:
            member = Member.objects.get(pk=pk)
            self.check_object_permissions(request, member.user)

            member.delete()

            
            private = Private.objects.filter(
                community_id=member.community_id).filter(
                user_id=member.user_id).first()


            if private is not None:
                private.delete()

            return Response({
                                'message': 'success',
                            }, status=status.HTTP_200_OK)

        except PermissionDenied as e:
            return Response({
                                'error': e.detail,
                            }, status=status.HTTP_403_FORBIDDEN)

class ByCommunityAPIView(APIView):
    def get(self, request):

        try:
            if 'community_id' not in request.query_params:
                raise NotFound

            member = Member.objects.get_by_community(
                request.user.id,
                request.query_params['community_id'])

            if member is None:
                raise NotFound('Could not find member.')


            serializer = MemberSerializer(member)
            return Response({
                                'message': 'success',
                                'member': serializer.data,
                            }, status=status.HTTP_200_OK)
        except NotFound as e:
            return Response({
                                'error': e.detail
                            }, status=status.HTTP_404_NOT_FOUND)

class ListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, ]
    def post(self, request):
        try:
            serializer = MemberCreateSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            Member.objects.create(
                serializer.validated_data['community'],
                serializer.validated_data['user']
                                  )
            return Response({
                                'message': 'success',
                            }, status=status.HTTP_200_OK)

        except ParseError:
            return Response({
                                'error': 'No communities found.'
                            }, status=status.HTTP_400_BAD_REQUEST)


