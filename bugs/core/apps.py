from django.apps import AppConfig
from django.conf import settings
from core.repository.world_data_repository import WorldDataRepository
from core.world.world_facade import WorldFacade

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'

    def ready(self):
        world_data_filepath = f'{settings.BASE_DIR}/world.json'
        world_data_repo = WorldDataRepository(world_data_filepath)

        world_facade = WorldFacade.init(world_data_repo)
        world_facade.init_world()
