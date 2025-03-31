from typing import List, Dict
from core.world.exceptions import GameError
from .colony_relation_types import ColonyRelationTypes

class ColonyRelationsTable():

    DEFAULT_RELATION_VALUE = 1

    @staticmethod
    def build_empty():
        return ColonyRelationsTable([])

    @staticmethod
    def build(relations_data: Dict):
        return ColonyRelationsTable(relations_data)

    def __init__(self, relations_data: Dict):
        self._relations_data: List = relations_data

    @property
    def relations(self):
        return self._relations_data

    def get_relation_value(self, colony1_id: int, colony2_id: int):
        if colony1_id == colony2_id:
            return ColonyRelationsTable.DEFAULT_RELATION_VALUE
        relation = self._find_relation(colony1_id, colony2_id)
        return relation['value'] if relation else ColonyRelationsTable.DEFAULT_RELATION_VALUE
    
    def set_relation_value(self, colony1_id: int, colony2_id: int, value: int, relation_type: ColonyRelationTypes) -> List:
        if colony1_id == colony2_id:
            raise GameError('invalid relation')
        relation = self._find_relation(colony1_id, colony2_id)
        if relation:
            relation['value'] = value
        else:
            relation = {
                'colony_ids': [colony1_id, colony2_id],
                'value': value,
                'type': relation_type
            }
            self._relations_data.append(relation)

    def clear_relations_for_colony(self, colony_id: int) -> List:
        removed_relations = []
        left_relations = []
        for relation in self._relations_data:
            if colony_id in relation['colony_ids']:
                removed_relations.append(relation)
            else:
                left_relations.append(relation)

        self._relations_data = left_relations

        return removed_relations

    def improve_ant_colonies_relations(self) -> List:
        for relation in self._relations_data:
            if relation['type'] == ColonyRelationTypes.ANT_ANT:
                relation['value'] += 1

        return self._clear_positive_relations()
    
    def get_colony_ids_with_negative_relation_to(self, colony_id: int, relation_type: ColonyRelationTypes = ColonyRelationTypes.ANT_ANT) -> List[int]:
        ids = set()
        for relation in self._relations_data:
            if colony_id in relation['colony_ids'] and relation['value'] < 0 and relation['type'] == relation_type:
                ids.update(relation['colony_ids'])
                
        if colony_id in ids:
            ids.remove(colony_id)

        return list(ids)

    def _clear_positive_relations(self):
        negative_relations = []
        positive_relations = []
        for relation in self._relations_data:
            if relation['value'] < 0:
                negative_relations.append(relation)
            else:
                positive_relations.append(relation)

        self._relations_data = negative_relations

        return positive_relations

    def _find_relation(self, colony1_id: int, colony2_id: int):
        for relation in self._relations_data:
            if colony1_id in relation['colony_ids'] and colony2_id in relation['colony_ids']:
                return relation
            
        return None
    