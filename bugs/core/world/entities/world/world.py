from threading import Thread
import time

from core.world.entities.map.map import Map
from core.world.utils.event_emiter import EventEmitter
from core.world.settings import STEP_TIME
from core.world.entities.colony.base.colony import Colony
from core.world.entities.colony.colonies.ant_colony.ant_colony import AntColony
from core.world.entities.base.entity_collection import EntityCollection
from core.world.id_generator import IdGenerator
from core.world.entities.colony.base.colony_relations_table import ColonyRelationsTable
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.ground_beetle.ground_beetle_spawner import GroundBeetleSpawner
from core.world.entities.action.colony_born_action import ColonyBornAction
from core.world.entities.ant.base.nuptial_environment.nuptial_environment import NuptialEnvironment
from core.world.entities.climate.climate import Climate
from .sensor_handlers.visual_sensor_handler import VisualSensorHandler
from .sensor_handlers.temperature_sensor_handler import TemperatureSensorHandler
from .notification.notification_manager import NotificationManager
from .notification.notifications.notification import Notification
from .player_stats import PlayerStats

from core.world.my_test_env import MY_TEST_ENV
from core.world.entities.ant.base.ant import Ant

from typing import List, Callable

class World():

    def __init__(self, entities_collection: EntityCollection, map: Map, event_bus: EventEmitter, colonies: List[Colony], id_generator: IdGenerator, 
                 colony_relations_table: ColonyRelationsTable, birthers, ground_beetle_spawner: GroundBeetleSpawner, nuptial_environments: List[NuptialEnvironment], 
                 player_stats_list: List[PlayerStats], climate: Climate, sensor_handlers, current_step: int, notification_manager: NotificationManager):
        self._entities_collection = entities_collection
        self._map = map
        self._event_bus = event_bus
        self._colonies: List[Colony] = colonies
        self._id_generator = id_generator
        self._world_loop_stop_flag = False
        self._is_world_running = False
        self._current_step = current_step
        self._colony_relations_table = colony_relations_table
        self._birthers = birthers
        self._ground_beetle_spawner = ground_beetle_spawner
        self._nuptial_environments = nuptial_environments
        self._player_stats_list = player_stats_list
        self._climate = climate
        self._visual_sensor_handler: VisualSensorHandler = sensor_handlers['visual_sensor_handler']
        self._temperature_sensor_handler: TemperatureSensorHandler = sensor_handlers['temperature_sensor_handler']
        self._notification_manager = notification_manager

        self._event_bus.add_listener('colony_died', self._on_colony_died)

    @property
    def current_step(self):
        return self._current_step

    @property
    def last_used_id(self):
        return self._id_generator.last_used_id
        
    @property
    def map(self):
        return self._map

    @property
    def is_world_running(self):
        return self._is_world_running
    
    @property
    def colonies(self):
        return self._colonies
    
    @property
    def ant_colonies(self):
        ant_colonies_filter: Callable[[Colony], bool] = lambda colony: colony.member_type == EntityTypes.ANT
        return list(filter(ant_colonies_filter, self._colonies))

    @property
    def colony_relations_table(self):
        return self._colony_relations_table
    
    @property
    def nuptial_environments(self):
        return self._nuptial_environments
    
    @property
    def player_stats_list(self):
        return self._player_stats_list
    
    @property
    def climate(self) -> Climate:
        return self._climate
    
    def get_player_stats_for_owner(self, owner_id: int) -> PlayerStats:
        for player_stats in self._player_stats_list:
            if player_stats.owner_id == owner_id:
                return player_stats
            
        return None
    
    def get_all_notifications(self) -> List[Notification]:
        return self._notification_manager.get_all_notifications()
    
    def get_notifications_for_owner(self, owner_id: int):
        return self._notification_manager.get_notifications_for_owner(owner_id)
    
    def generate_id(self):
        return self._id_generator.generate_id()
    
    def add_new_colony(self, colony: Colony):
        self._colonies.append(colony)
        self._event_bus.emit('colony_born', colony)
        self._event_bus.emit('action', ColonyBornAction.build(colony))

    def get_colony_by_id(self, colony_id: int) -> Colony:
        for colony in self._colonies:
            if colony.id == colony_id:
                return colony
        
        return None
    
    def get_ant_colonies_by_owner(self, owner_id: int):
        ant_colonies = self.ant_colonies
        owner_filter: Callable[[AntColony], bool] = lambda colony: colony.owner_id == owner_id
        return list(filter(owner_filter, ant_colonies))
    
    def get_nuptial_environment_by_owner(self, owner_id: int) -> NuptialEnvironment:
        for environment in self._nuptial_environments:
            if environment.owner_id == owner_id:
                return environment
            
        return None
    
    def stop(self):
        if (not self._is_world_running): 
            return
        self._world_loop_stop_flag = True
        self._is_world_running = False

    def run(self):
        if (self._is_world_running):
            return
        world_thread = Thread(target=self._run_world_loop)
        world_thread.start()
        self._world_loop_stop_flag = False
        self._is_world_running = True

    def _run_world_loop(self):
        while not self._world_loop_stop_flag:
            iteration_start = time.time()

            self._do_step()

            iteration_end = time.time()
            iteration_time = iteration_end - iteration_start
            
            if (STEP_TIME - iteration_time > 0):
                time.sleep(STEP_TIME - iteration_time)

    def _do_step(self):
        print(f'step { self._current_step }')

        self._event_bus.emit('step_start', self._current_step)

        not_live_entities = self._map.get_not_live_entities()
        for entity in not_live_entities:
            entity.do_step()
        
        entities = self._map.get_live_entities()
        for entity in entities:
            self._temperature_sensor_handler.handle_sensor(entity)
            self._visual_sensor_handler.handle_sensor(entity)
            entity.do_step(self._current_step)

        self._event_bus.emit('step_done', self._current_step)

        # self._my_test_code()

        self._current_step += 1

    def _on_colony_died(self, colony: Colony):
        self._colonies.remove(colony)

    def _my_test_code(self):
        if self._current_step == 163:
           ant: Ant = MY_TEST_ENV['attacker']
           oper_ant: Ant = self._map.get_entity_by_id(94)
           ant.fight_enemy(oper_ant)