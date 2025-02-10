from .utils.event_emiter import EventEmitter
from .services.colony_service import ColonyService
from .services.player_service import PlayerService
from .services.nuptial_environment_service import NuptialEnvironmentService
from core.world.utils.point import Point
from core.world.world_repository_interface import iWorldRepository
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes
from core.world.services.ant_service import AntService
from core.world.entities.ant.base.guardian_behaviors import GuardianBehaviors
from core.world.services.rating_serivice import RatingService
from core.world.services.world_service import WorldService
from core.world.entities.world.season_types import SeasonTypes
from core.world.settings import WORLD_ID
from core.world.entities.world.world import World
from core.world.entities.world.id_generator import IdGenerator
from core.world.entities.action.base.action import Action
from core.world.services.notification_serivce import NotificationService
from core.world.services.colony_relations_service import ColonyRelationsService
from core.world.services.birthers.ant_birther_service import AntBirtherService
from core.world.services.birthers.item_birther_service import ItemBirtherService
from core.world.services.birthers.nest_birther_service import NestBirtherService
from core.world.services.birthers.ladybug_birther_service import LadybugBirtherService
from core.world.services.spawners.ladybug_spawner_service import LadybugSpawnerService
from core.world.services.spawners.bug_corpse_spawner_service import BugCorpseSpawnerService
from core.world.exceptions import GameError

from typing import Callable, List, Dict

class WorldFacade:
    _instance = None

    @classmethod
    def get_instance(cls) -> 'WorldFacade':
        return WorldFacade._instance

    def __init__(self, event_bus: EventEmitter, world_repository: iWorldRepository, colony_service: ColonyService, player_service: PlayerService, 
                 nuptial_environment_service: NuptialEnvironmentService, ant_service: AntService, rating_service: RatingService, notification_service: NotificationService,
                 colony_relations_service: ColonyRelationsService, ant_birther_service: AntBirtherService, item_birther_service: ItemBirtherService,  
                 nest_birther_service: NestBirtherService, ladybug_birther_service: LadybugBirtherService, ladybug_spawner_service: LadybugSpawnerService,
                 bug_corpse_spawner_service: BugCorpseSpawnerService, world_service: WorldService):
        if WorldFacade._instance != None:
            raise GameError('WorldFacade is singleton')
        else:
            WorldFacade._instance = self

        self._events = EventEmitter()
        self._event_bus = event_bus
        self._world_repository = world_repository

        self._colony_service = colony_service
        self._player_service = player_service
        self._nuptial_environment_service = nuptial_environment_service
        self._ant_service = ant_service
        self._rating_service = rating_service
        self._notification_service = notification_service
        self._colony_relations_service = colony_relations_service
        self._ant_birther_service = ant_birther_service
        self._item_birther_service = item_birther_service
        self._nest_birther_service = nest_birther_service
        self._ladybug_birther_service = ladybug_birther_service
        self._ladybug_spawner_service = ladybug_spawner_service
        self._bug_corpse_spawner_service = bug_corpse_spawner_service
        self._world_service = world_service

        self._world = None

        self._event_bus.add_listener('step_done', self._on_step_done)
        self._event_bus.add_listener('action', self._on_action)

    @property
    def world(self):
        return self._world
    
    @property
    def is_world_inited(self):
        return bool(self._world)
    
    @property
    def is_world_running(self):
        return self.is_world_inited and self._world.is_world_running
    
    def add_listener(self, event_name: str, callback: Callable):
        self._events.add_listener(event_name, callback)

    def remove_listener(self, event_name: str, callback: Callable):
        self._events.remove_listener(event_name, callback)
    
    # <ADMIN_COMMANDS>
    def init_world_admin_command(self):
        self._init_world()

    def save_world_admin_command(self):
        self._world_repository.push(self._world, WORLD_ID)
    
    def run_world_admin_command(self):
        self._world.run()

    def stop_world_admin_command(self):
        self._world.stop()

    def expand_map_admin_command(self, chunk_rows: int, chunk_cols: int):
        return self._world_service.expand_current_map(chunk_rows, chunk_cols)
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
            return self._colony_service.destroy_nest_operation(user_id, performing_colony_id, nest_id, workers_count, warriors_count)

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
            self._colony_service.found_new_colony(user_id, queen_id, nuptial_male_id, nest_building_site, colony_name)

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

    def get_specie_for_client(self, user_id: int):
        return self._nuptial_environment_service.get_specie_for(user_id)
    
    def get_nuptial_males_for_client(self, user_id: int):
        return self._nuptial_environment_service.get_nuptial_males_for_owner(user_id)
    
    def get_notifications_for_client(self, user_id: int):
        return self._notification_service.find_notifications_for_owner(user_id)
    
    def get_rating(self):
        return self._rating_service.rating
    
    def _init_world(self) -> World:
        is_world_newly_generated = False
        self._world = self._world_repository.get(WORLD_ID)
        if not self._world:
            self._world = self._world_service.build_new_empty_world(4, 4)
            is_world_newly_generated = True

        IdGenerator.set_global_generator(self._world.id_generator)

        if is_world_newly_generated:
            self._world_service.populate_empty_world(self._world)

        self._colony_service.set_world(self._world)
        self._player_service.set_world(self._world)
        self._nuptial_environment_service.set_world(self._world)
        self._ant_service.set_world(self._world)
        self._rating_service.set_world(self._world)
        self._notification_service.set_world(self._world)
        self._colony_relations_service.set_world(self._world)
        self._ant_birther_service.set_world(self._world)
        self._item_birther_service.set_world(self._world)
        self._nest_birther_service.set_world(self._world)
        self._ladybug_birther_service.set_world(self._world)
        self._ladybug_spawner_service.set_world(self._world)
        self._bug_corpse_spawner_service.set_world(self._world)
        self._world_service.set_world(self._world)
    
    def _on_step_done(self, step_number: int, season: SeasonTypes):
        self._events.emit('step_done')

    def _on_action(self, action: Action):
        self._events.emit('action', action)
