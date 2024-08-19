from typing import List
from .entity import Entity

class EntityCollection():

    @classmethod
    def build_entity_collection(cls):
        return EntityCollection()

    def __init__(self):
        self._entities = {}

    def add_entity(self, entity: Entity):
        self._entities[entity.id] = entity

    def delete_entity(self, id: int):
        self._entities.pop(id)

    def get_entity_by_id(self, id: int) -> Entity:
        return self._entities[id]

    def get_entities(self, ids: List[int] = None) -> List[Entity]:
        if ids is not None:
            res = []
            for id in ids:
                res.append(self._entities[id])
                
            return res
        else:
            return list(self._entities.values())
    