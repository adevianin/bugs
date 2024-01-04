from .utils.event_emiter import EventEmitter
from .services.colony_service import ColonyService
from .services.operation_service import OperationService
from .services.user_service import UserService
from core.world.utils.point import Point
from core.world.world_repository_interface import iWorldRepository
from .world_client_serializer_interface import iWorldClientSerializer
from .action_client_serializer_interface import iActionClientSerializer
from core.world.entities.action.action import Action

from typing import Callable, List

class WorldFacade:
    _instance = None
    WORLD_ID = 1

    @classmethod
    def init(cls, event_bus: EventEmitter, world_client_serializer: iWorldClientSerializer, action_client_serializer: iActionClientSerializer,
             world_repository: iWorldRepository, operation_service: OperationService, colony_service: ColonyService, user_service: UserService):
        events = EventEmitter()
        world_facade = WorldFacade(event_bus, events, world_client_serializer, action_client_serializer, world_repository, operation_service, colony_service, user_service)
        WorldFacade._instance = world_facade
        return world_facade

    @classmethod
    def get_instance(cls) -> 'WorldFacade':
        return WorldFacade._instance

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, world_client_serializer: iWorldClientSerializer, action_client_serializer: iActionClientSerializer,
                 world_repository: iWorldRepository, operation_service: OperationService, colony_service: ColonyService, user_service: UserService):
        if WorldFacade._instance != None:
            raise Exception('WorldFacade is singleton')
        else:
            WorldFacade._instance = self

        self._events = events
        self._event_bus = event_bus
        self._world_repository = world_repository
        self._world_client_serializer = world_client_serializer
        self._action_client_serializer = action_client_serializer

        self._operation_service = operation_service
        self._colony_service = colony_service
        self._user_service = user_service

        self._event_bus.add_listener('step_start', self._on_step_start)
        self._event_bus.add_listener('action', self._on_action)
        
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
        self._events.add_listener(event_name, callback)

    def remove_listener(self, event_name: str, callback: Callable):
        self._events.remove_listener(event_name, callback)

    def get_my_colony(self, user_id: int):
        return self._world.get_colony_owned_by_user(user_id)
    
    def build_user_starter_pack(self, user_id: int):
        self._user_service.build_user_starter_pack(user_id)

    def stop_operation_command(self, user_id: int, colony_id: int, operation_id: int):
        self._operation_service.stop_operation(user_id, colony_id, operation_id)
    
    def build_new_sub_nest_operation_command(self, user_id: int, performing_colony_id: int, building_site: List[int], workers_count: int):
        building_site = Point.from_json(building_site)
        self._operation_service.build_new_sub_nest(user_id, performing_colony_id, building_site, workers_count)
    
    def destroy_nest_operation_command(self, user_id: int, performing_colony_id: int, nest_id: int, warriors_count: int):
        self._operation_service.destroy_nest_operation(user_id, performing_colony_id, nest_id, warriors_count)

    def pillage_nest_operation_command(self, user_id: int, performing_colony_id: int, nest_to_pillage_id: int, nest_for_loot_id: int, workers_count: int, warriors_count: int):
        self._operation_service.pillage_nest_operation(user_id, performing_colony_id, nest_to_pillage_id, nest_for_loot_id, workers_count, warriors_count)

    def add_larva_command(self, user_id: int, nest_id: int, larva_type: str):
        self._colony_service.add_larva(user_id, nest_id, larva_type)

    def fly_nuptian_flight_command(self, user_id: int, ant_id: int):
        self._colony_service.fly_nuptial_flight(user_id, ant_id)

    def get_world_for_client(self):
        return self._world_client_serializer.serialize(self._world)
    
    def _on_step_start(self, step_number: int):
        self._events.emit('step')

    def _on_action(self, action: Action):
        serialized_action = self._action_client_serializer.serialize(action)
        self._events.emit('action_occured', serialized_action)
