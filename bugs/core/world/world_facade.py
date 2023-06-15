from .world_data_repository_interface import iWorldDataRepository
from .utils.event_emiter import EventEmitter
from .entities.ant.ant_factory import AntFactory
from .entities.food.food_factory import FoodFactory
from .world_factory import WorldFactory
from .world import World
from .services.nest_service import NestService
from .entities.nest.nest_factory import NestFactory
from .map import Map
from .utils.size import Size
from .services.birther_service import BirtherService
from .services.colony_service import ColonyService
from .entities.colony.colony_factory import ColonyFactory
from core.world.utils.point import Point
from core.world.entities.colony.operation.operation_factory import OperationFactory

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
        nest_factory = NestFactory(self._event_bus)
        food_factory = FoodFactory(self._event_bus)
        colony_factory = ColonyFactory(self._event_bus, map)
        operation_factory = OperationFactory()
        world_factory = WorldFactory(self._event_bus, ant_factory, food_factory, nest_factory, colony_factory)

        self._world = world_factory.build_world_from_json(world_data, map)

        self._colony_service = ColonyService(self._world, operation_factory, nest_factory)
        self._nest_service = NestService(self._world)
        birther_service = BirtherService(self._event_bus, map, ant_factory, food_factory)

        self._world.run()

    @property
    def world(self):
        return self._world
    
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

    def get_my_colony(self, user_id: int):
        return self._world.get_colony_owned_by_user(user_id)
    
    def handle_command(self, command_json, user_id):
        params = command_json['params']
        match command_json['command_type']:
            case 'add_larva':
                self._nest_service.add_larva(params['nest_id'], user_id, params['larva_type'])
            case 'build_new_nest':
                self._colony_service.build_new_nest(user_id, Point(params['position']['x'], params['position']['y']))
            case _:
                raise Exception('unknown type of command')
        