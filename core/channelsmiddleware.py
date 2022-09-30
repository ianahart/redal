from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from jwt import decode as jwt_decode
from urllib.parse import parse_qs
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async
from django.conf import settings
import logging
logger = logging.getLogger('django')


@database_sync_to_async
def get_user(user_id):
    User = get_user_model()
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return 'AnonymousUser'


class TokenAuthMiddleware:

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        token = parse_qs(scope["query_string"].decode("utf8"))["token"][0]
        try:
            is_valid = UntypedToken(token)
        except (InvalidToken, TokenError) as e:
            logger.error(
                'Unauthorized user trying to access websocket connection.')
            print(e)
            return None
        else:
            decoded_data = jwt_decode(
                token, settings.SECRET_KEY, algorithms=["HS256"])
            scope['user'] = await get_user(int(decoded_data.get('user_id', None))) #type:ignore
        return await self.app(scope, receive, send)

