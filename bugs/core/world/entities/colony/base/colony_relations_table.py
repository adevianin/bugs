from typing import List, Dict
from core.world.exceptions import GameError

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
    def relations_data(self):
        return self._relations_data

    def get_relation_value(self, colony1_id: int, colony2_id: int):
        if colony1_id == colony2_id:
            return ColonyRelationsTable.DEFAULT_RELATION_VALUE
        relation = self._find_relation(colony1_id, colony2_id)
        return relation['value'] if relation else ColonyRelationsTable.DEFAULT_RELATION_VALUE
    
    def set_relation_value(self, colony1_id: int, colony2_id: int, value: int):
        if colony1_id == colony2_id:
            raise GameError('invalid relation')
        relation = self._find_relation(colony1_id, colony2_id)
        if relation:
            relation['value'] = value
        else:
            relation = {
                'colony_ids': [colony1_id, colony2_id],
                'value': value
            }
            self._relations_data.append(relation)

    def clear_relations_for_colony(self, colony_id: int):
        self._relations_data = [relation for relation in self._relations_data if colony_id not in relation['colony_ids']]

    def improve_relations_except(self, except_colony_ids: List[int]):
        for relation in self._relations_data:
            colony1_id = relation['colony_ids'][0]
            colony2_id = relation['colony_ids'][1]
            if colony1_id not in except_colony_ids and colony2_id not in except_colony_ids:
                relation['value'] += 1

        self._clear_positive_relations()

    def _clear_positive_relations(self):
        self._relations_data = [relation for relation in self._relations_data if relation['value'] < 0]

    def _find_relation(self, colony1_id: int, colony2_id: int):
        for relation in self._relations_data:
            if colony1_id in relation['colony_ids'] and colony2_id in relation['colony_ids']:
                return relation
            
        return None