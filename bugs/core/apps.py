from django.apps import AppConfig
from core.repository.world_data_repository import WorldDataRepository
from core.world import WorldFactory, WorldFacade
from django.conf import settings
from pyee.base import EventEmitter

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'

    def ready(self):
        world_data_filepath = f'{settings.BASE_DIR}/world.json'
        world_data_repo = WorldDataRepository(world_data_filepath)

        main_event_bus = EventEmitter()

        world_factory = WorldFactory(main_event_bus)

        world_facade = WorldFacade.get_instance()
        world_facade.inject_data_repository(world_data_repo)
        world_facade.inject_main_bus(main_event_bus)
        world_facade.inject_world_factory(world_factory)

        world_facade.run()
