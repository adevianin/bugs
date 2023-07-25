from core.world.utils.event_emiter import EventEmitter
from core.world.entities.map.map import Map
from .world import World
from core.world.entities.colony.colony import Colony
from core.world.entities.base.entity_collection import EntityCollection
from core.world.id_generator import IdGenerator
from core.world.entities.colony.colony_relations_table import ColonyRelationsTable
from typing import List

class WorldFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_world(self, id: int, entities_collection: EntityCollection, map: Map, colonies: List[Colony], id_generator: IdGenerator, colony_relations_table: ColonyRelationsTable) -> World:
        return World(id, entities_collection, map, self._event_bus, colonies, id_generator, colony_relations_table)
    
