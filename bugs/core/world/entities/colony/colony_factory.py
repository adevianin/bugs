from core.world.utils.event_emiter import EventEmitter
from core.world.entities.map.map import Map
from typing import List
from .operation.operation import Operation
from .colony_relations_table import ColonyRelationsTable
from .relation_tester import RelationTester
from .ant_colony import AntColony

class ColonyFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_new_ant_colony(self, id: int, owner_id: int, map: Map, colony_relations_table: ColonyRelationsTable) -> AntColony:
        return self.build_ant_colony(id=id, owner_id=owner_id, map=map, operations=[], colony_relations_table=colony_relations_table)

    def build_ant_colony(self, id: int, owner_id: int, map: Map, operations: List[Operation], colony_relations_table: ColonyRelationsTable) -> AntColony:
        relation_tester = self._build_relation_tester(colony_relations_table, id)
        return AntColony(id, self._event_bus, owner_id, map, operations, relation_tester)
    
    def _build_relation_tester(self, colony_relations_table: ColonyRelationsTable, colony_id: int):
        return RelationTester(colony_relations_table, colony_id)
    