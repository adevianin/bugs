from core.world.utils.event_emiter import EventEmitter
from core.world.entities.map.map import Map
from .world import World
from core.world.entities.colony.base.colony import Colony
from core.world.entities.colony.base.colony_relations_table import ColonyRelationsTable
from core.world.entities.ant.ant_factory import AntFactory
from core.world.entities.item.items.item_factory import ItemFactory
from core.world.entities.nest.nest_factory import NestFactory
from core.world.entities.ant.base.nuptial_environment.nuptial_environment import NuptialEnvironment
from core.world.entities.climate.climate import Climate
from .notification.notifications.notification import Notification
from .player_stats import PlayerStats
from core.world.entities.ladybug.ladybug_factory import LadybugFactory
from core.world.entities.world.id_generator import IdGenerator

from typing import List

class WorldFactory():

    def __init__(self, event_bus: EventEmitter, ant_factory: AntFactory, item_factory: ItemFactory, nest_factory: NestFactory, ladybug_factory: LadybugFactory, game_logger):
        self._event_bus = event_bus
        self._ant_factory = ant_factory
        self._item_factory = item_factory
        self._nest_factory = nest_factory
        self._ladybug_factory = ladybug_factory
        self._game_logger = game_logger

    def build_world(self, map: Map, colonies: List[Colony], colony_relations_table: ColonyRelationsTable, 
                    nuptial_environments: List[NuptialEnvironment], player_stats_list: List[PlayerStats], climate: Climate, current_step: int, 
                    notifications: List[Notification], last_used_id: int) -> World:
        id_generator = IdGenerator(last_used_id)

        return World(map, self._event_bus, colonies, nuptial_environments, notifications, player_stats_list, climate, 
                    current_step, colony_relations_table, id_generator, self._game_logger)
    
