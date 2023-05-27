from .world_data_repository_interface import iWorldDataRepository
from .utils.event_emiter import EventEmitter
from .entities.ant.ant_factory import AntFactory
from .entities.food.food_factory import FoodFactory
from .world_factory import WorldFactory
from .world import World
from .services.town_service import TownService
from .services.command_handler_service import CommandHandlerService
from .entities.town.town_factory import TownFactory
from .map import Map
from .utils.size import Size
from .services.birther_service import BirtherService

from typing import Callable

class WorldFacade:
    _instance = None
    WORLD_ID = 1

    @classmethod
    def init(cls, data_repository: iWorldDataRepository):
        WorldFacade._instance = WorldFacade(data_repository)
        return WorldFacade._instance

    @classmethod
    def get_instance(cls):
        return WorldFacade._instance

    def __init__(self, data_repository: iWorldDataRepository):
        if WorldFacade._instance != None:
            raise Exception('WorldFacade is singleton')
        else:
            WorldFacade._instance = self
        
        self._data_repository = data_repository
        self._world: World

    def init_world(self):
        world_data = self._data_repository.get(self.WORLD_ID)

        map_data = world_data['map']
        map = Map.build_map(Size(map_data['size']['width'], map_data['size']['height']))

        self._event_bus = EventEmitter()
        
        ant_factory = AntFactory(self._event_bus, map)
        town_factory = TownFactory(self._event_bus)
        food_factory = FoodFactory(self._event_bus)
        world_factory = WorldFactory(self._event_bus, ant_factory, food_factory, town_factory)

        self._world = world_factory.build_world_from_json(world_data, map)

        self._town_service = TownService(self._world, world_factory)
        self._command_handler_service = CommandHandlerService(self._town_service)
        birther_service = BirtherService(self._event_bus, map, ant_factory, food_factory)

        self._world.run()

    @property
    def world(self):
        return self._world

    def get_world_json(self):
        return self._world.to_json()
    
    def run(self):
        self._world.run()

    def stop(self):
        self._world.stop()

    def is_world_running(self):
        return self._world.is_world_running

    def add_listener(self, event_name: str, callback: Callable):
        self._event_bus.add_listener(event_name, callback)

    def remove_listener(self, event_name: str, callback: Callable):
        self._event_bus.remove_listener(event_name, callback)

    def handle_command(self, command_json, user_id):
        self._command_handler_service.handle_command(command_json, user_id)