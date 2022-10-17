import django
from .channelsmiddleware import TokenAuthMiddleware
from channels.auth import AuthMiddlewareStack
import os
from channels.routing import ProtocolTypeRouter, URLRouter

from django.core.asgi import get_asgi_application
asgi = get_asgi_application()
#os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

import notification.routing
import chat.routing

os.environ['DJANGO_SETTINGS_MODULE'] = 'core.settings'


django.setup()

application = ProtocolTypeRouter({
    "http": asgi,
     "websocket": TokenAuthMiddleware(
           URLRouter(
               notification.routing.websocket_urlpatterns +
               chat.routing.websocket_urlpatterns,
           )
       ),
})

