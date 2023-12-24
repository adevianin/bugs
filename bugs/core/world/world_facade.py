from .utils.event_emiter import EventEmitter
from .services.nest_service import NestService
from .services.operation_service import OperationService
from .services.user_service import UserService
from core.world.utils.point import Point
from core.world.world_repository_interface import iWorldRepository

from typing import Callable

class WorldFacade:
    _instance = None
    WORLD_ID = 1

    @classmethod
    def init(cls, event_bus: EventEmitter,  world_repository: iWorldRepository, operation_service: OperationService, nest_service: NestService, user_service: UserService):
        world_facade = WorldFacade(event_bus, world_repository, operation_service, nest_service, user_service)
        WorldFacade._instance = world_facade
        return world_facade

    @classmethod
    def get_instance(cls) -> 'WorldFacade':
        return WorldFacade._instance

    def __init__(self, event_bus: EventEmitter, world_repository: iWorldRepository, operation_service: OperationService, nest_service: NestService, user_service: UserService):
        if WorldFacade._instance != None:
            raise Exception('WorldFacade is singleton')
        else:
            WorldFacade._instance = self

        self._event_bus = event_bus
        self._world_repository = world_repository

        self._operation_service = operation_service
        self._nest_service = nest_service
        self._user_service = user_service
        
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
    
    def build_user_starter_pack(self, user_id: int):
        self._user_service.build_user_starter_pack(user_id)
    
    def handle_command(self, command_json, user_id):
        params = command_json['params']
        match command_json['command_type']:
            case 'add_larva':
                self._nest_service.add_larva(params['nest_id'], user_id, params['larva_type'])
            case 'stop_operation':
                self._operation_service.stop_operation(user_id, params['colony_id'], params['operation_id'])
            case 'build_new_sub_nest':
                building_site = Point(params['building_site']['x'], params['building_site']['y'])
                performing_colony_id = params['performing_colony_id']
                workers_count = params['workers_count']
                self._operation_service.build_new_sub_nest(user_id, performing_colony_id, building_site, workers_count)
            case 'destroy_nest':
                performing_colony_id = params['performing_colony_id']
                nest_id = params['nest_id']
                warriors_count = params['warriors_count']
                self._operation_service.destroy_nest_operation(user_id, performing_colony_id, nest_id, warriors_count)
            case 'pillage_nest':
                performing_colony_id = params['performing_colony_id']
                nest_to_pillage_id = params['nest_to_pillage_id']
                nest_for_loot_id = params['nest_for_loot_id']
                warriors_count = params['warriors_count']
                workers_count = params['workers_count']
                self._operation_service.pillage_nest_operation(user_id, performing_colony_id, nest_to_pillage_id, nest_for_loot_id, workers_count, warriors_count)
            case _:
                raise Exception('unknown type of command')
            