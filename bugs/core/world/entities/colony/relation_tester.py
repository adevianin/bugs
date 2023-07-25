from .colony_relations_table import ColonyRelationsTable
from core.world.entities.base.entity import Entity

class RelationTester():

    def __init__(self, colony_relations_table: ColonyRelationsTable, colony_id: int):
        self._colony_relations_table = colony_relations_table
        self._colony_id = colony_id

    def is_enemy(self, entity: Entity):
        if entity.from_colony == self._colony_id: 
            return False
        return self._colony_relations_table.get_relation_value(entity.from_colony, self._colony_id) < 0