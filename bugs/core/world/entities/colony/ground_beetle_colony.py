from core.world.entities.base.entity import Entity
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.colony.relation_tester import RelationTester
from core.world.entities.map.map import Map
from core.world.utils.event_emiter import EventEmitter
from .colony import Colony

class GroundBeetleColony(Colony):

    def __init__(self, id: int, event_bus: EventEmitter, map: Map, relation_tester: RelationTester):
        super().__init__(id, EntityTypes.GROUND_BEETLE, event_bus, map, relation_tester)

    def _on_my_entity_born(self, entity: Entity):
        super()._on_my_entity_born(entity)

    def _on_my_entity_died(self, entity: Entity):
        pass
