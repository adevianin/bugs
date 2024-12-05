from .utils.event_emiter import EventEmitter
from .services.colony_service import ColonyService
from .services.player_service import PlayerService
from .services.nuptial_environment_service import NuptialEnvironmentService
from core.world.utils.point import Point
from core.world.world_repository_interface import iWorldRepository
from .world_client_serializer_interface import iWorldClientSerializer
from .action_client_serializer_interface import iActionClientSerializer
from core.world.entities.ant.base.ant_types import AntTypes
from .nuptial_environment_client_serializer_interface import iNuptialEnvironmentClientSerializer
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes
from core.world.services.ant_service import AntService
from core.world.entities.ant.base.guardian_behaviors import GuardianBehaviors
from core.sync.constants_client_serializer import ConstantsClientSerializer
from core.world.action_accumulator import ActionAccumulator
# make interface
from core.sync.notification_client_serializer import NotificationClientSerializer
from core.world.services.rating_serivice import RatingService
from core.world.services.world_service import WorldService
from core.world.entities.world.season_types import SeasonTypes
from core.world.settings import WORLD_ID

from typing import Callable, List, Dict

class WorldFacade:
    _instance = None

    @classmethod
    def get_instance(cls) -> 'WorldFacade':
        return WorldFacade._instance

    def __init__(self, event_bus: EventEmitter, world_client_serializer: iWorldClientSerializer, action_client_serializer: iActionClientSerializer, 
                 nuptial_environment_client_serializer: iNuptialEnvironmentClientSerializer, constants_client_serializer: ConstantsClientSerializer, 
                 notification_client_serializer: NotificationClientSerializer, world_repository: iWorldRepository, colony_service: ColonyService, 
                 player_service: PlayerService, nuptial_environment_service: NuptialEnvironmentService, ant_service: AntService, action_accumulator: ActionAccumulator, 
                 rating_service: RatingService, world_service: WorldService):
        if WorldFacade._instance != None:
            raise Exception('WorldFacade is singleton')
        else:
            WorldFacade._instance = self

        self._events = EventEmitter()
        self._event_bus = event_bus
        self._world_repository = world_repository
        self._world_client_serializer = world_client_serializer
        self._action_client_serializer = action_client_serializer
        self._nuptial_environment_client_serializer = nuptial_environment_client_serializer
        self._constants_client_serializer = constants_client_serializer
        self._notification_client_serializer = notification_client_serializer

        self._colony_service = colony_service
        self._player_service = player_service
        self._nuptial_environment_service = nuptial_environment_service
        self._ant_service = ant_service
        self._rating_service = rating_service
        self._world_service = world_service

        self._action_accumulator = action_accumulator
        self._serialized_common_actions = []

        self._event_bus.add_listener('step_done', self._on_step_done)

    @property
    def world(self):
        return self._world
        
    def init_world(self):
        self._world = self._world_repository.get(WORLD_ID)
        if not self._world:
            self._world = self._world_service.generate_new_world(4, 4)

    def add_listener(self, event_name: str, callback: Callable):
        self._events.add_listener(event_name, callback)

    def remove_listener(self, event_name: str, callback: Callable):
        self._events.remove_listener(event_name, callback)
    
    # <ADMIN_COMMANDS>
    def save_world_admin_command(self):
        self._world_repository.push(self._world, WORLD_ID)
    
    def run_world_admin_command(self):
        self._world.run()

    def stop_world_admin_command(self):
        self._world.stop()

    def expand_map_admin_command(self, chunk_rows: int, chunk_cols: int):
        return self._world_service.expand_current_map(chunk_rows, chunk_cols)

    def is_world_running(self):
        return self._world.is_world_running
    # </ADMIN_COMMANDS>

    # <PLAYER_COMMANDS>
    def stop_operation_command(self, user_id: int, colony_id: int, operation_id: int):
        with self._world.lock:
            self._colony_service.stop_operation(user_id, colony_id, operation_id)
    
    def build_new_sub_nest_operation_command(self, user_id: int, performing_colony_id: int, building_site: Point, workers_count: int, warriors_count: int, nest_name: str):
        with self._world.lock:
            return self._colony_service.build_new_sub_nest(user_id, performing_colony_id, building_site, workers_count, warriors_count, nest_name)
    
    def destroy_nest_operation_command(self, user_id: int, performing_colony_id: int, nest_id: int, workers_count: int, warriors_count: int):
        with self._world.lock:
            self._colony_service.destroy_nest_operation(user_id, performing_colony_id, nest_id, workers_count, warriors_count)

    def pillage_nest_operation_command(self, user_id: int, performing_colony_id: int, nest_to_pillage_id: int, nest_for_loot_id: int, workers_count: int, warriors_count: int):
        with self._world.lock:
            self._colony_service.pillage_nest_operation(user_id, performing_colony_id, nest_to_pillage_id, nest_for_loot_id, workers_count, warriors_count)

    def transfer_food_operation_command(self, user_id: int, performing_colony_id: int, from_nest_id: int, to_nest_id: int, workers_count: int, warriors_count: int):
        with self._world.lock:
            self._colony_service.transfer_food_operation(user_id, performing_colony_id, from_nest_id, to_nest_id, workers_count, warriors_count)

    def build_fortification_operation_command(self, user_id: int, performing_colony_id: int, nest_id: int, workers_count: int):
        with self._world.lock:
            self._colony_service.build_fortification_operation(user_id, performing_colony_id, nest_id, workers_count)
        
    def bring_bug_operation_command(self, user_id: int, performing_colony_id: int, nest_id: int):
        with self._world.lock:
            return self._colony_service.bring_bug_operation(user_id, performing_colony_id, nest_id)

    def add_egg_command(self, user_id: int, nest_id: int, name: str, is_fertilized: bool):
        with self._world.lock:
            return self._colony_service.add_egg(user_id, nest_id, name, is_fertilized)

    def change_egg_caste_command(self, user_id: int, nest_id: int, egg_id: str, ant_type: AntTypes):
        with self._world.lock:
            self._colony_service.change_egg_caste(user_id, nest_id, egg_id, ant_type)

    def change_egg_name_command(self, user_id: int, nest_id: int, egg_id: str, name: str):
        with self._world.lock:
            self._colony_service.change_egg_name(user_id, nest_id, egg_id, name)

    def move_egg_to_larva_chamber_command(self, user_id: int, nest_id: int, egg_id: str):
        with self._world.lock:
            self._colony_service.move_egg_to_larva_chamber(user_id, nest_id, egg_id)

    def delete_egg_command(self, user_id: int, nest_id: int, egg_id: str):
        with self._world.lock:
            self._colony_service.delete_egg(user_id, nest_id, egg_id)

    def delete_larva_command(self, user_id: int, nest_id: int, larva_id: str):
        with self._world.lock:
            self._colony_service.delete_larva(user_id, nest_id, larva_id)

    def found_colony_command(self, user_id: int, queen_id: int, nuptial_male_id: int, nest_building_site: Point, colony_name: str):
        with self._world.lock:
            self._nuptial_environment_service.found_new_colony(user_id, queen_id, nuptial_male_id, nest_building_site, colony_name)

    def born_new_antara_command(self, user_id: int):
        with self._world.lock:
            self._player_service.born_new_antara(user_id)

    def fly_nuptial_flight_command(self, user_id: int, ant_id: int):
        with self._world.lock:
            self._ant_service.fly_nuptial_flight(user_id, ant_id)

    def change_ant_guardian_behavior_command(self, user_id: int, ant_id: int, guaridan_behavior: GuardianBehaviors):
        with self._world.lock:
            self._ant_service.change_ant_guardian_behavior(user_id, ant_id, guaridan_behavior)

    def change_ant_cooperative_behavior_command(self, user_id: int, ant_id: int, is_enabled: bool):
        with self._world.lock:
            self._ant_service.change_ant_cooperative_behavior(user_id, ant_id, is_enabled)

    def relocate_ant_command(self, user_id: int, ant_id: int, nest_id: int):
        with self._world.lock:
            self._ant_service.relocate_ant(user_id, ant_id, nest_id)

    def change_specie_schema_command(self, user_id: int, specie_schema: Dict[ChromosomeTypes, List[str]]):
        with self._world.lock:
            return self._nuptial_environment_service.change_specie_schema(user_id, specie_schema)

    def rename_nest_command(self, user_id: int, nest_id: int, name: str):
        with self._world.lock:
            self._colony_service.rename_nest(user_id, nest_id, name)

    def ensure_starter_pack_built_for_player(self, user_id: int):
        with self._world.lock:
            self._player_service.ensure_starter_pack_built_for_player(user_id)
    # </PLAYER_COMMANDS>

    def get_specie_for_client(self, user_id: int) -> Dict:
        specie = self._nuptial_environment_service.get_specie_for(user_id)
        return self._nuptial_environment_client_serializer.serialize_specie(specie)
    
    def get_nuptial_males_for_client(self, user_id: int):
        nuptial_environment = self._world.get_nuptial_environment_by_owner(user_id)
        return self._nuptial_environment_client_serializer.serialize_nuptial_males(nuptial_environment.males)
    
    def get_world_for_client(self):
        return self._world_client_serializer.serialize(self._world)
    
    def get_consts_for_client(self):
        return self._constants_client_serializer.serialize_constants()
    
    def get_current_actions_pack_for_client(self, user_id: int):
        personal_actions = self._action_accumulator.pull_personal_actions(user_id)
        serialized_personal_actions = [self._action_client_serializer.serialize(action) for action in personal_actions]
        return self._serialized_common_actions + serialized_personal_actions
    
    def get_notifications_for_client(self, user_id: int):
        notifications = self._world.get_notifications_for_owner(user_id)
        serialized_notifications = [self._notification_client_serializer.serialize(notification) for notification in notifications]
        return serialized_notifications
    
    def get_rating(self):
        return self._rating_service.rating
    
    def _on_step_done(self, step_number: int, season: SeasonTypes):
        self._serialize_common_actions()
        self._events.emit('step', step_number, season)

    def _serialize_common_actions(self):
        actions = self._action_accumulator.pull_common_actions()
        self._serialized_common_actions = [self._action_client_serializer.serialize(action) for action in actions]
