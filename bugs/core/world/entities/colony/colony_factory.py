from core.world.utils.event_emiter import EventEmitter
from .colony import Colony
from core.world.entities.map.map import Map
from typing import List
from .operation.operation import Operation
from .colony_relations_table import ColonyRelationsTable
from .relation_tester import RelationTester

class ColonyFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_colony(self, id: int, owner_id: int, map: Map, operations: List[Operation], colony_relations_table: ColonyRelationsTable):
        colony_communicator = EventEmitter()
        relation_tester = self.build_relation_tester(colony_relations_table, id)
        return Colony(id, self._event_bus, owner_id, map, operations, relation_tester, colony_communicator)
    
    def build_relation_tester(self, colony_relations_table: ColonyRelationsTable, colony_id: int):
        return RelationTester(colony_relations_table, colony_id)
    