from core.world.utils.event_emiter import EventEmitter
from core.world.entities.map.map import Map
from .world import World
from core.world.entities.colony.base.colony import Colony
from core.world.entities.base.entity_collection import EntityCollection
from core.world.id_generator import IdGenerator
from core.world.entities.colony.base.colony_relations_table import ColonyRelationsTable
from core.world.entities.ant.ant_factory import AntFactory
from core.world.entities.item.items.item_factory import ItemFactory
from core.world.entities.nest.nest_factory import NestFactory
from core.world.entities.ground_beetle.ground_beetle_spawner import GroundBeetleSpawner
from core.world.entities.ground_beetle.ground_beetle_factory import GroundBeetleFactory
from core.world.entities.world.birthers.ant_birther import AntBirther
from core.world.entities.world.birthers.item_birther import ItemBirther
from core.world.entities.world.birthers.nest_birther import NestBirther
from core.world.entities.world.birthers.ground_beetle_birther import GroundBeetleBirther
from core.world.entities.ant.base.nuptial_environment.nuptial_environment import NuptialEnvironment
from core.world.entities.climate.climate import Climate
from .sensor_handlers.visual_sensor_handler import VisualSensorHandler
from .sensor_handlers.temperature_sensor_handler import TemperatureSensorHandler
from .notification.notifications.notification import Notification
from .notification.notification_manager import NotificationManager
from core.world.entities.colony.base.colony_relations_manager import ColonyRelationsManager
from .player_stats import PlayerStats

from typing import List

class WorldFactory():

    def __init__(self, event_bus: EventEmitter, ant_factory: AntFactory, item_factory: ItemFactory, nest_factory: NestFactory, ground_beetle_factory: GroundBeetleFactory):
        self._event_bus = event_bus
        self._ant_factory = ant_factory
        self._item_factory = item_factory
        self._nest_factory = nest_factory
        self._ground_beetle_factory = ground_beetle_factory

    def build_world(self, last_used_id: int, entities_collection: EntityCollection, map: Map, colonies: List[Colony], colony_relations_table: ColonyRelationsTable, 
                    nuptial_environments: List[NuptialEnvironment], player_stats_list: List[PlayerStats], climate: Climate, current_step: int, 
                    notifications: List[Notification]) -> World:
        id_generator = IdGenerator.build_id_generator(last_used_id)
        ground_beetle_spawner = GroundBeetleSpawner(self._event_bus, map)
        birthers = {
            'ant_birther': AntBirther(self._event_bus, id_generator, map, self._ant_factory),
            'item_birther': ItemBirther(self._event_bus, id_generator, map, self._item_factory),
            'nest_birther': NestBirther(self._event_bus, id_generator, map, self._nest_factory),
            'ground_beetle_birther': GroundBeetleBirther(self._event_bus, id_generator, map, self._ground_beetle_factory)
        }
        sensor_handlers = {
            'visual_sensor_handler': VisualSensorHandler(self._event_bus, map),
            'temperature_sensor_handler': TemperatureSensorHandler(climate)
        }
        managers = {
            'colony_relations_manager': ColonyRelationsManager(self._event_bus, colony_relations_table),
            'notification_manager': NotificationManager(self._event_bus, notifications)
        }

        return World(entities_collection, map, self._event_bus, colonies, id_generator, birthers, ground_beetle_spawner, nuptial_environments, 
                    player_stats_list, climate, sensor_handlers, current_step, managers)
    
