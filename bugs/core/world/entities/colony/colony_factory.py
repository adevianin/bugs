from core.world.utils.event_emiter import EventEmitter
from .colony import Colony
from core.world.entities.base.entity_collection import EntityCollection
from core.world.entities.map.map import Map
from typing import List
from .operation.operation import Operation

class ColonyFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_colony(self, id: int, owner_id: int, map: Map, operations: List[Operation]):
        return Colony(id, self._event_bus, owner_id, map, operations)
    