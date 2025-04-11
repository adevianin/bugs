from core.world.entities.colony.base.colony_relations_table import ColonyRelationsTable
from core.world.entities.colony.base.colony_relation_types import ColonyRelationTypes
from typing import List, Dict

class ColonyRelationsTableDeserializer():

    def deserialize(self, relations_data: List) -> ColonyRelationsTable:
        return ColonyRelationsTable.build([self._deserialize_relation(relation_data) for relation_data in relations_data])
    
    def _deserialize_relation(self, relation_data: Dict):
        return {
            'colony_ids': relation_data['colony_ids'],
            'value': relation_data['value'],
            'type': ColonyRelationTypes(relation_data['type'])
        }