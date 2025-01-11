"""
ASGI config for bugs project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
"""

import os

from django.urls import re_path
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.security.websocket import AllowedHostsOriginValidator
from channels.auth import AuthMiddlewareStack
from core.data.client.main_socket_consumer import MainSocketConsumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bugs.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": 
    # AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter([
                re_path('mainsocket', MainSocketConsumer.as_asgi()),
            ])
        )
    # )
})
