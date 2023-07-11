from .utils.event_emiter import EventEmitter
from .entities.ant.ant_factory import AntFactory
from .entities.food.food_factory import FoodFactory
from .entities.world.world_factory import WorldFactory
from .services.nest_service import NestService
from .entities.nest.nest_factory import NestFactory
from .services.birther_service import BirtherService
from .services.colony_service import ColonyService
from .entities.colony.colony_factory import ColonyFactory
from core.world.utils.point import Point
from core.world.entities.colony.operation.operation_factory import OperationFactory
from .entities.thought.thought_factory import ThoughtFactory
from core.world.world_repository_interface import iWorldRepository

from typing import Callable

class WorldFacade:
    _instance = None
    WORLD_ID = 1

    @classmethod
    def init(cls, event_bus: EventEmitter,  world_repository: iWorldRepository, colony_service: ColonyService, nest_service: NestService, birther_service: BirtherService):
        world_facade = WorldFacade(event_bus, world_repository, colony_service, nest_service, birther_service)
        WorldFacade._instance = world_facade
        return world_facade

    @classmethod
    def get_instance(cls):
        return WorldFacade._instance

    def __init__(self, event_bus: EventEmitter, world_repository: iWorldRepository, colony_service: ColonyService, nest_service: NestService, birther_service: BirtherService):
        if WorldFacade._instance != None:
            raise Exception('WorldFacade is singleton')
        else:
            WorldFacade._instance = self

        self._event_bus = event_bus
        self._world_repository = world_repository

        self._colony_service = colony_service
        self._nest_service = nest_service
        self._birther_service = birther_service
        
    def init_world(self):
        self._world = self._world_repository.get(self.WORLD_ID)

        self._colony_service.set_world(self._world)
        self._nest_service.set_world(self._world)
        self._birther_service.set_world(self._world)

        self._world.run()

    def save_world(self):
        json = self.to_full_json()
        self._data_repository.push(self.WORLD_ID, json)

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
            case 'stop_operation':
                self._colony_service.stop_operation(user_id, params['operation_id'])
            case _:
                raise Exception('unknown type of command')
            
    def to_full_json(self):
        world_json = self.world.to_full_json()
        world_json.update({
            'last_used_id': self._id_generator.last_used_id
        })
        
        return world_json
        