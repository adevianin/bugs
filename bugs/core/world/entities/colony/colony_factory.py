from core.world.utils.event_emiter import EventEmitter
from .colony import Colony
from core.world.entities.base.entity_collection import EntityCollection
from .colony_ants_collection import ColonyAntsCollection
from typing import List
from .operation.operation import Operation

class ColonyFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_colony(self, id: int, owner_id: int, entities_collection: EntityCollection, operations: List[Operation]):
        ants_collection = ColonyAntsCollection.build_colony_ants_collection(entities_collection, id)
        return Colony(id, self._event_bus, owner_id, ants_collection, operations)
    