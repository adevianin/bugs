from django.apps import AppConfig
from django.conf import settings
import sys

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'

    def ready(self):
        if 'runserver' in sys.argv:
            from core.repository.world_data_repository import WorldDataRepository
            from core.world.world_facade import WorldFacade

            world_facade = WorldFacade.init(WorldDataRepository())
            world_facade.init_world()
