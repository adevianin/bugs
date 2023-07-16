from .utils.event_emiter import EventEmitter
from .services.nest_service import NestService
from .services.colony_service import ColonyService
from core.world.utils.point import Point
from core.world.world_repository_interface import iWorldRepository

from typing import Callable

class WorldFacade:
    _instance = None
    WORLD_ID = 1

    @classmethod
    def init(cls, event_bus: EventEmitter,  world_repository: iWorldRepository, colony_service: ColonyService, nest_service: NestService):
        world_facade = WorldFacade(event_bus, world_repository, colony_service, nest_service)
        WorldFacade._instance = world_facade
        return world_facade

    @classmethod
    def get_instance(cls):
        return WorldFacade._instance

    def __init__(self, event_bus: EventEmitter, world_repository: iWorldRepository, colony_service: ColonyService, nest_service: NestService):
        if WorldFacade._instance != None:
            raise Exception('WorldFacade is singleton')
        else:
            WorldFacade._instance = self

        self._event_bus = event_bus
        self._world_repository = world_repository

        self._colony_service = colony_service
        self._nest_service = nest_service
        
    def init_world(self):
        self._world = self._world_repository.get(self.WORLD_ID)

    def save_world(self):
        self._world_repository.push(self._world)

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
            