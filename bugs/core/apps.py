from django.apps import AppConfig
from django.conf import settings
import sys

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'

    def ready(self):
        if 'runserver' in sys.argv:
            from core.data.init_layer import init_data_layer
            from core.world.init_layer import init_domain_layer

            world_facade = init_domain_layer()
            world_repository = init_data_layer(**world_facade.fabrics)

            world_facade.init_world(world_repository)
            
