from core.world.entities.base.entity import Entity
from typing import List, Callable
from core.world.entities.base.entity_types import EntityTypes

class WorldInteractor():
    
    def set_nearby_entities(self, entities: List[Entity]):
        self._nearby_entities = entities

    def get_nearby_entities(self, types_list: List[EntityTypes] = None, filter: Callable = None):
        res = []
        for entity in self._nearby_entities:
            if (not types_list or entity.type in types_list) and (not filter or filter(entity)):
                res.append(entity)

        return res