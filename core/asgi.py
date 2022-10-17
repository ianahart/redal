import os
from channels.routing import ProtocolTypeRouter, URLRouter

from django.core.asgi import get_asgi_application
asgi = get_asgi_application()
from channels.auth import AuthMiddlewareStack
from .channelsmiddleware import TokenAuthMiddleware
#os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
os.environ['DJANGO_SETTINGS_MODULE'] = 'core.settings'

import django
django.setup()
import chat.routing
import notification.routing

application = ProtocolTypeRouter({
  "http": asgi,
  "websocket": TokenAuthMiddleware(
        URLRouter(
            chat.routing.websocket_urlpatterns +
            notification.routing.websocket_urlpatterns
        )
    ),
})


