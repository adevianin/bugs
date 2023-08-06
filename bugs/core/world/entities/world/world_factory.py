from core.world.utils.event_emiter import EventEmitter
from core.world.entities.map.map import Map
from .world import World
from core.world.entities.colony.colony import Colony
from core.world.entities.base.entity_collection import EntityCollection
from core.world.id_generator import IdGenerator
from core.world.entities.colony.colony_relations_table import ColonyRelationsTable
from core.world.entities.ant.ant_factory import AntFactory
from core.world.entities.food.food_factory import FoodFactory
from core.world.entities.nest.nest_factory import NestFactory
from core.world.entities.world.birther import Birther
from typing import List

class WorldFactory():

    def __init__(self, event_bus: EventEmitter, ant_factory: AntFactory, food_factory: FoodFactory, nest_factory: NestFactory):
        self._event_bus = event_bus
        self._ant_factory = ant_factory
        self._food_factory = food_factory
        self._nest_factory = nest_factory

    def build_world(self, id: int, last_used_id: int, entities_collection: EntityCollection, map: Map, colonies: List[Colony], colony_relations_table: ColonyRelationsTable) -> World:
        id_generator = IdGenerator.build_id_generator(last_used_id)
        birther = Birther(id_generator, map, self._ant_factory, self._food_factory, self._nest_factory)
        return World(id, entities_collection, map, self._event_bus, colonies, id_generator, colony_relations_table, birther)
    
