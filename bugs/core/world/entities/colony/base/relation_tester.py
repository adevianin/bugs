from .colony_relations_table import ColonyRelationsTable
from core.world.entities.base.entity_types import EntityTypesPack
from core.world.entities.base.enemy_interface import iEnemy
from core.world.exceptions import GameError

class RelationTester():

    def __init__(self, colony_relations_table: ColonyRelationsTable, colony_id: int):
        self._colony_relations_table = colony_relations_table
        self._colony_id = colony_id

    def is_enemy(self, entity: iEnemy):
        if entity.type not in EntityTypesPack.LIVE_ENTITIES:
            raise GameError('enemy can be only live entity')
        if entity.from_colony_id == self._colony_id: 
            return False
        return self._colony_relations_table.get_relation_value(entity.from_colony_id, self._colony_id) < 0