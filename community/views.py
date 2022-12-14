from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.exceptions import NotFound, ParseError
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import FormParser, MultiPartParser
from community.models import Community
from member.models import Member
from account.permissions import AccountPermission
from community.serializers import CommunityNameSerializer, CommunitySearchSerializer, CommunitySerializer, CreateCommunitySerializer, FileSerializer
import json

from private.models import Private




class DetailsAPIView(APIView):
    permission_classes = [IsAuthenticated, AccountPermission, ]

    def get(self, request, pk: int):
        try:

            community = Community.objects.get_community(pk, request.user.id)
            if community and community['type'] == 'error': 
                raise NotFound('This community does not exist anymore.')


            is_member = Member.objects.is_member(pk, request.user.id)

            serializer = CommunitySerializer(community['data'])


            return Response({
                                'message': 'success',
                                'community': serializer.data,
                                'is_member': is_member

                            }, status=status.HTTP_200_OK)
        except NotFound as e:
            return Response({
                                'error': e.detail,
                            }, status=status.HTTP_404_NOT_FOUND)

class SearchCommunityAPIView(APIView):
    permission_classes = [AllowAny, ]

    def post(self, request):
        try:

            serializer = CommunitySearchSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            if 'page' not in request.query_params:
                raise ParseError

            results = Community.objects.search_results(
                serializer.validated_data,
                request.query_params['page'],
                request.user.id,
            )

            community_serializer = CommunitySerializer(results['communities'], many=True)

            return Response({
                                'message': 'success',
                                'has_next': results['has_next'],
                                'page': results['page'],
                                'communities': community_serializer.data
                            }, status=status.HTTP_200_OK)

        except ParseError:
            return Response({
                                'error': 'No results found.'
                            }, status=status.HTTP_404_NOT_FOUND)





class ListCommunityNameAPIView(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request):
        try:
            if 'page' not in request.query_params:
               raise NotFound

            page = request.query_params['page']


            result = Community.objects.retrieve_names(int(request.user.id), int(page))
            serializer = CommunityNameSerializer(result['communities'], many=True)
            return Response({
                                'message': 'success',
                                'communities': serializer.data,
                                'page': result['page'],
                                'has_next': result['has_next']
                            }, status=status.HTTP_200_OK)





            return Response({
                                'message': 'success',
                            }, status=status.HTTP_200_OK)
        except NotFound as e:
            return Response({
                                'error': 'Unable to retreive communitiy titles.'
                            }, status=status.HTTP_400_BAD_REQUEST)




class ListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, ]
    def get(self, request):
        try:
            if 'page' not in request.query_params:
               raise NotFound

            page = request.query_params['page']


            result = Community.objects.retrieve_all(int(request.user.id), int(page))
            serializer = CommunitySerializer(result['communities'], many=True)
            return Response({
                                'message': 'success',
                                'communities': serializer.data,
                                'page': result['page'],
                                'has_next': result['has_next']
                            }, status=status.HTTP_200_OK)

        except NotFound:
            return Response({
                                'error': 'No communities found.'
                            }, status=status.HTTP_404_NOT_FOUND)

class CreateCommunityAPIView(APIView):
    permission_classes = [IsAuthenticated, ]
    parser_classes = [ MultiPartParser, FormParser, ]

    def post(self, request):
       try:

            form_serializer = CreateCommunitySerializer(data=json.loads(request.data['form']))
            form_serializer.is_valid(raise_exception=True)
            name, type, user, author = form_serializer.validated_data.values()
            file_serializer = FileSerializer(data=request.data)
            file_serializer.is_valid(raise_exception=True)
            file = file_serializer.validated_data['file']

            community = Community.objects.create(file, author, user, name, type)

            Member.objects.create(community, user)

            Private.objects.author({
                                       'community': community,
                                       'user': user,
                                   })

            result = Community.objects.retrieve_all(request.user.id, 0)
            serializer = CommunitySerializer(result['communities'], many=True)



            return Response({
                                'message': 'success',
                                'communities': serializer.data,
                                'page': result['page'],
                                'has_next': result['has_next']

                            }, status=status.HTTP_200_OK)
       except ParseError:
            return Response({
                                'error': 'Unable to create your community, please review your fields.'
                            }, status=status.HTTP_400_BAD_REQUEST)

