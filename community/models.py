from django.db import  DatabaseError, models
from django.db.models import Q
from django.utils import timezone
from typing import Dict, Any
from django.core.paginator import Paginator
from slugify import slugify #type:ignore
from account.models import CustomUser
from member.models import Member
from private.models import Private
from services.file_upload import FileUpload
import random
import logging
logger = logging.getLogger('django')

class CommunityManager(models.Manager):


    def get_community(self, pk: int, user_id: int):
        try:
            community = Community.objects.get(pk=pk)
            member = Private.objects.all().filter(community_id=pk).filter(user_id=user_id).first()

            print(member)
            if community.type == 'private' and member is None:
                return {'type': 'error', 'msg': 'This community is private'}
            return {'type': 'ok', 'data': community}
        except DatabaseError as e:
            logger.error('Unable to retrieve community by it\'s id.')
            return {'type': 'error', 'msg': 'This community is private'}



    def search_results(self, data: Dict[str, str], page: int, user_id: int):
        try:
            ids = Private.objects.filter(
                user_id=user_id).values_list('user_id', flat=True)

            objects = Community.objects.all().filter(
                Q(name__icontains=data['value'])).filter(

                Q(type='public') | Q(type='private') & Q(user_id=user_id) 
                    | Q(member_community__user_id__in=ids)
            ).distinct()


            paginator = Paginator(objects, 2)
            next_page = int(page) + 1

            cur_page = paginator.page(next_page)

            return {
                'has_next': cur_page.has_next(),
                'page': next_page,
                'communities': cur_page.object_list
            }

        except DatabaseError:
            logger.error('Unable to retrieve seach results for communities.')
            return {
                'has_next': False,
                'page': 0,
                'communities': []
            }


    def retrieve_names(self, user_id: int, page: int):
        try:
            objects = Community.objects.select_related(
                'user').all().order_by('-id').filter(
                member_community__user_id=user_id)

            paginator = Paginator(objects, 4)

            next_page = page + 1;
            cur_page = paginator.page(next_page)

            return {
                'has_next': cur_page.has_next(),
                'page': next_page,
                'communities': cur_page.object_list
            }
        except DatabaseError:
            logger.error('Unable to fetch community titles.')
            return {
                'has_next': False,
                'page': 0,
                'communities': []
            }

    def retrieve_all(self, user_id: int, page: int):
        try:
            objects = Community.objects.select_related(
                'user').all().order_by('-id').filter(
                member_community__user_id=user_id)

            paginator = Paginator(objects, 2)

            next_page = page + 1;
            cur_page = paginator.page(next_page)

            return {
                'has_next': cur_page.has_next(),
                'page': next_page,
                'communities': cur_page.object_list
            }

        except DatabaseError:
            logger.error('Unable to retrieve authors communities')
            return {
                'has_next': False,
                'page': 0,
                'communities': []
            }


    def create(self, file, author, user, name, type):
        try:
            aws = FileUpload(file, 'communities')
            image_url, image_filename = aws.upload()
            community = self.model(
                name=name,
                author=author,
                type=type,
                slug=slugify(name),
                user=user,
                image_url=image_url,
                image_filename=image_filename
            )

            community.save()
            community.refresh_from_db()

            return community
        except DatabaseError:
            logger.error('Unable to create a community.')

class Community(models.Model):


    objects: CommunityManager = CommunityManager()

    TYPE_CHOICES = (
        ('public', 'Publc'),
        ('private', 'Private')
    )

    name = models.CharField(max_length=200, unique=True)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    image_url = models.URLField(blank=True, null=True)
    slug = models.CharField(max_length=200, blank=True, null=True)
    image_filename = models.TextField(max_length=300, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    author = models.ForeignKey(
    'account.CustomUser',
    on_delete=models.CASCADE,
    related_name='community_author',
        blank=True,
        null=True
)
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='community_user'
    )

