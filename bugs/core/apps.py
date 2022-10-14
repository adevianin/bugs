from django.apps import AppConfig
from core.world import World, WorldDataRepository, WorldFactory
from django.conf import settings

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'

    def ready(self):
        world_data_filepath = f'{settings.BASE_DIR}/world.json'
        world_data_repo = WorldDataRepository(world_data_filepath)

        world_factory = WorldFactory()

        world = World.get_instance()
        world.inject_data_repository(world_data_repo)
        world.inject_world_factory(world_factory)

        world.run()
