from core.world.entities.base.entity import Entity
from typing import List
from core.world.entities.base.entity_types import EntityTypes

class WorldInteractor():
    
    def set_nearby_entities(self, entities: List[Entity]):
        self._nearby_entities = entities

    def get_nearby_entities(self, types: EntityTypes = []):
        if (len(types) == 0): 
            return self._nearby_entities
        else:
            res = []
            for entity in self._nearby_entities:
                if entity.type in types:
                    res.append(entity)
            
            return res