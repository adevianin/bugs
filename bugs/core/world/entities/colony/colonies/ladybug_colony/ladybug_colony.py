from core.world.entities.base.entity import Entity
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.colony.base.relation_tester import RelationTester
from core.world.entities.map.map import Map
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.colony.base.colony import Colony

class LadybugColony(Colony):

    def __init__(self, id: int, event_bus: EventEmitter, map: Map, relation_tester: RelationTester):
        super().__init__(id, EntityTypes.LADYBUG, event_bus, map, relation_tester)

    def _on_my_entity_born(self, entity: Entity):
        super()._on_my_entity_born(entity)

    def _on_my_entity_died(self, entity: Entity):
        pass
