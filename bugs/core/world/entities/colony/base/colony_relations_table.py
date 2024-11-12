from typing import List, Dict

class ColonyRelationsTable():

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
            raise Exception('invalid relation')
        relation = self._get_relation(colony1_id, colony2_id)

        return relation['value']
    
    def set_relation_value(self, colony1_id: int, colony2_id: int, value: int):
        if colony1_id == colony2_id:
            raise Exception('invalid relation')
        relation = self._get_relation(colony1_id, colony2_id)

        relation['value'] = value

    def _get_relation(self, colony1_id: int, colony2_id: int):
        relation = self._find_relation(colony1_id, colony2_id)
        if not relation:
            relation = self._init_relation(colony1_id, colony2_id)
        
        return relation
            
    def _init_relation(self, colony1_id: int, colony2_id: int):
        relation = {
            'colony_ids': [colony1_id, colony2_id],
            'value': 1
        }
        self._relations_data.append(relation)

        return relation
    
    def _find_relation(self, colony1_id: int, colony2_id: int):
        for relation in self._relations_data:
            if colony1_id in relation['colony_ids'] and colony2_id in relation['colony_ids']:
                return relation
            
        return None