from core.world.utils.event_emiter import EventEmitter
from core.world.entities.map.map import Map
from typing import List
from core.world.entities.colony.colonies.ant_colony.operation.base.operation import Operation
from core.world.entities.colony.base.colony_relations_table import ColonyRelationsTable
from core.world.entities.colony.base.relation_tester import RelationTester
from core.world.entities.colony.colonies.ant_colony.ant_colony import AntColony
from core.world.entities.colony.colonies.ground_beetle_colony.ground_beetle_colony import GroundBeetleColony
from core.world.entities.colony.colonies.ant_colony.operation.operation_factory import OperationFactory

class ColonyFactory():

    def __init__(self, event_bus: EventEmitter, operation_factory: OperationFactory):
        self._event_bus = event_bus
        self._operation_factory = operation_factory

    def build_new_ant_colony(self, id: int, owner_id: int, map: Map, colony_relations_table: ColonyRelationsTable, queen_id: int) -> AntColony:
        return self.build_ant_colony(id=id, owner_id=owner_id, map=map, operations=[], colony_relations_table=colony_relations_table, queen_id=queen_id)

    def build_ant_colony(self, id: int, owner_id: int, map: Map, operations: List[Operation], colony_relations_table: ColonyRelationsTable, queen_id: int) -> AntColony:
        relation_tester = self._build_relation_tester(colony_relations_table, id)
        return AntColony(id, self._event_bus, self._operation_factory, owner_id, map, operations, relation_tester, queen_id)
    
    def build_ground_beetle_colony(self, id: int, map: Map, colony_relations_table: ColonyRelationsTable):
        relation_tester = self._build_relation_tester(colony_relations_table, id)
        return GroundBeetleColony(id, self._event_bus, map, relation_tester)
    
    def _build_relation_tester(self, colony_relations_table: ColonyRelationsTable, colony_id: int):
        return RelationTester(colony_relations_table, colony_id)
    