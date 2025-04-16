from core.world.entities.map.map import Map
from core.world.utils.event_emiter import EventEmitter
from core.world.settings import STEP_TIME, STEPS_IN_YEAR, SPRING_START_YEAR_STEP, SUMMER_START_YEAR_STEP, AUTUMN_START_YEAR_STEP, WINTER_START_YEAR_STEP
from core.world.entities.colony.base.colony import Colony
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.ant.base.nuptial_environment.nuptial_environment import NuptialEnvironment
from core.world.entities.climate.climate import Climate
from .notification.notifications.notification import Notification
from .player_stats import PlayerStats
from .season_types import SeasonTypes
from core.world.entities.ant.base.ant import Ant
from core.world.entities.world.id_generator import IdGenerator
from core.world.entities.colony.base.colony_relations_table import ColonyRelationsTable
from bugs.settings import DEBUG
from core.world.entities.colony.colonies.ant_colony.ant_colony import AntColony

from logging import Logger
from typing import List, Callable

class World():

    def __init__(self, map: Map, event_bus: EventEmitter, colonies: List[Colony], nuptial_environments: List[NuptialEnvironment], 
                 notifications: List[Notification], player_stats_list: List[PlayerStats], climate: Climate, current_step: int, 
                 relations_table: ColonyRelationsTable, id_generator: IdGenerator, logger: Logger):
        self._map = map
        self._event_bus = event_bus
        self._colonies: List[Colony] = colonies
        self._world_loop_stop_flag = False
        self._is_world_running = False
        self._current_step = current_step
        self._current_season = self._calc_current_season()
        self._relations_table = relations_table
        self._nuptial_environments = nuptial_environments
        self._notifications = notifications
        self._player_stats_list = player_stats_list
        self._climate = climate
        self._id_generator = id_generator
        self._logger = logger

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
    def ant_colonies(self) -> List[AntColony]:
        ant_colonies_filter: Callable[[Colony], bool] = lambda colony: colony.member_type == EntityTypes.ANT
        return list(filter(ant_colonies_filter, self._colonies))

    @property
    def colony_relations_table(self) -> ColonyRelationsTable:
        return self._relations_table
    
    @property
    def nuptial_environments(self):
        return self._nuptial_environments
    
    @property
    def notifications(self) -> List[Notification]:
        return self._notifications
    
    @property
    def player_stats_list(self) -> List[PlayerStats]:
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

    def add_new_player_stats(self, player_stats: PlayerStats):
        self._player_stats_list.append(player_stats)
    
    def add_new_colony(self, colony: Colony):
        self._colonies.append(colony)
        self._event_bus.emit('colony_born', colony)

    def remove_colony(self, colony: Colony):
        self._colonies.remove(colony)

    def get_colony_by_id(self, id: int):
        for colony in self._colonies:
            if colony.id == id:
                return colony
            
        return None

    def do_step(self):
        self._set_current_season(self._calc_current_season()) 

        self._event_bus.emit('step_start', self._current_step, self._current_season)

        entities = self._map.get_all_entities()
        for entity in entities:
            try:
                if not entity.is_died: #in case if first entity in list killed next entity
                    entity.do_step(self._current_step, self._current_season)
            except Exception as e:
                self._logger.exception(f'entity(id={ entity.id }) step({self._current_step}) error', exc_info=e)
                if DEBUG:
                    raise e

        self._event_bus.emit('step_done', self._current_step, self._current_season)

        self._current_step += 1

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
        is_season_changed = season != self._current_season
        self._current_season = season
        if is_season_changed:
            self._event_bus.emit('season_changed', season)

    def _test_kill(self, id):
        entity = self._map.find_entity_by_id(id)
        if entity:
            entity.simple_die()

    def _test_walk_to(self):
        from core.world.utils.point import Point
        from core.world.entities.nest.nest import Nest
        ant1: Ant = self._map.get_entity_by_id(271)
        ant1.walk_to(Point(3146,3400))

    def _test_spawn_ladybug(self, x, y):
        from core.world.entities.world.birth_requests.ladybug_birth_request import LadybugBirthRequest
        from core.world.utils.point import Point
        self._event_bus.emit('ladybug_birth_request', LadybugBirthRequest(Point(x,y)))

    def _test_start_summer(self):
        self._current_step = SUMMER_START_YEAR_STEP - 2
        self._climate._current_temp = 4

