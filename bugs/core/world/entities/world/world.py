from core.world.entities.map.map import Map
from core.world.utils.event_emiter import EventEmitter
from core.world.settings import STEP_TIME, STEPS_IN_YEAR, SPRING_START_YEAR_STEP, SUMMER_START_YEAR_STEP, AUTUMN_START_YEAR_STEP, WINTER_START_YEAR_STEP
from core.world.entities.colony.base.colony import Colony
from core.world.entities.colony.base.colony_relations_manager import ColonyRelationsManager
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.ant.base.nuptial_environment.nuptial_environment import NuptialEnvironment
from core.world.entities.climate.climate import Climate
from .sensor_handlers.visual_sensor_handler import VisualSensorHandler
from .sensor_handlers.temperature_sensor_handler import TemperatureSensorHandler
from .notification.notifications.notification import Notification
from .player_stats import PlayerStats
from .season_types import SeasonTypes
from core.world.entities.ant.base.ant import Ant
from core.world.entities.world.id_generator import IdGenerator

from logging import Logger
from typing import List, Callable
import threading
import time

class World():

    def __init__(self, map: Map, event_bus: EventEmitter, colonies: List[Colony], birthers, spawners, nuptial_environments: List[NuptialEnvironment], 
                 notifications: List[Notification], player_stats_list: List[PlayerStats], climate: Climate, sensor_handlers, current_step: int, 
                 managers, id_generator: IdGenerator, logger: Logger):
        self.lock = threading.Lock()
        self._map = map
        self._event_bus = event_bus
        self._colonies: List[Colony] = colonies
        self._world_loop_stop_flag = False
        self._is_world_running = False
        self._current_step = current_step
        self._current_season = self._calc_current_season()
        self._colony_relations_manager: ColonyRelationsManager = managers['colony_relations_manager']
        self._birthers = birthers
        self._spawners = spawners
        self._nuptial_environments = nuptial_environments
        self._notifications = notifications
        self._player_stats_list = player_stats_list
        self._climate = climate
        self._visual_sensor_handler: VisualSensorHandler = sensor_handlers['visual_sensor_handler']
        self._temperature_sensor_handler: TemperatureSensorHandler = sensor_handlers['temperature_sensor_handler']
        self._id_generator = id_generator
        self._logger = logger

        self._event_bus.add_listener('colony_died', self._on_colony_died)

    @property
    def id_generator(self):
        return self._id_generator

    @property
    def current_step(self):
        return self._current_step

    @property
    def current_season(self):
        return self._current_season

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
        return self._colony_relations_manager.relations_table
    
    @property
    def nuptial_environments(self):
        return self._nuptial_environments
    
    @property
    def notifications(self) -> List[Notification]:
        return self._notifications
    
    @property
    def player_stats_list(self):
        return self._player_stats_list
    
    @property
    def climate(self) -> Climate:
        return self._climate
    
    @property
    def _is_new_year_step(self):
        return self._current_step % STEPS_IN_YEAR == 0
    
    @property
    def _current_year(self):
        return self._current_step // STEPS_IN_YEAR
    
    def add_new_notification(self, notification: Notification):
        self._notifications.append(notification)
    
    def add_new_nuptial_environment(self, nuptial_environment: NuptialEnvironment):
        self._nuptial_environments.append(nuptial_environment)
        nuptial_environment.handle_season(self._current_season)

    def add_new_player_stats(self, player_stats: PlayerStats):
        self._player_stats_list.append(player_stats)
    
    def add_new_colony(self, colony: Colony):
        self._colonies.append(colony)

    def stop(self):
        if (not self._is_world_running): 
            return
        self._world_loop_stop_flag = True
        self._is_world_running = False

    def run(self):
        if (self._is_world_running):
            return
        world_thread = threading.Thread(target=self._run_world_loop, daemon=True)
        world_thread.start()
        self._world_loop_stop_flag = False
        self._is_world_running = True

    def _run_world_loop(self):
        while not self._world_loop_stop_flag:
            iteration_start = time.time()
            step_number = self._current_step
            self._logger.info(f'step start: { step_number }')
            try:
                with self.lock:
                    self._do_step()
            except Exception as e:
                self._logger.error(str(e))
                raise e

            iteration_end = time.time()
            iteration_time = iteration_end - iteration_start

            self._logger.info(f'step time: { iteration_time }')
            self._logger.info(f'step done: { step_number }')

            if (STEP_TIME - iteration_time > 0):
                time.sleep(STEP_TIME - iteration_time)

    def _do_step(self):
        self._set_current_season(self._calc_current_season()) 

        self._event_bus.emit('step_start', self._current_step, self._current_season)

        not_live_entities = self._map.get_not_live_entities()
        for entity in not_live_entities:
            entity.do_step()
        
        entities = self._map.get_live_entities()
        for entity in entities:
            if not entity.is_died: #in case if first entity in list killed next entity
                self._temperature_sensor_handler.handle_sensor(entity)
                self._visual_sensor_handler.handle_sensor(entity)
                entity.do_step(self._current_step)

        self._event_bus.emit('step_done', self._current_step, self._current_season)

        # self._my_test_code()

        self._current_step += 1

    def _on_colony_died(self, colony: Colony):
        self._colonies.remove(colony)

    def _calc_current_season(self) -> SeasonTypes:
        year_step = self._current_step % STEPS_IN_YEAR
        if year_step >= SPRING_START_YEAR_STEP and year_step < SUMMER_START_YEAR_STEP:
            return SeasonTypes.SPRING
        elif year_step >= SUMMER_START_YEAR_STEP and year_step < AUTUMN_START_YEAR_STEP:
            return SeasonTypes.SUMMER
        elif year_step >= AUTUMN_START_YEAR_STEP and year_step < WINTER_START_YEAR_STEP:
            return SeasonTypes.AUTUMN
        elif year_step >= WINTER_START_YEAR_STEP:
            return SeasonTypes.WINTER

    def _set_current_season(self, season: SeasonTypes):
        if season != self._current_season:
            self._event_bus.emit('season_changed', season)
        self._current_season = season

    def _my_test_code(self, id):
        from core.world.utils.point import Point
        from core.world.entities.nest.nest import Nest
        ant1: Ant = self._map.get_entity_by_id(id)
        ant1.walk_to(Point(930,1843))

