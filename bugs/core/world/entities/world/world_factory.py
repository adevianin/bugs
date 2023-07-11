from core.world.utils.event_emiter import EventEmitter
from core.world.entities.map import Map
from .world import World
from core.world.entities.colony.colony import Colony
from core.world.entities.base.entity_collection import EntityCollection
from typing import List

class WorldFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_world(self, id: int, entities_collection: EntityCollection, map: Map, colonies: List[Colony]) -> World:
        return World(id, entities_collection, map, self._event_bus, colonies)
    
