from core.world.entities.base.entity import Entity
from core.world.entities.base.entity_types import EntityTypes
from core.world.utils.point import Point

from typing import List

import math

class Memory():

    def __init__(self, data = None):
        self._data = data or []

    @property
    def data(self):
        return self._data

    def remember_entities_at(self, point: Point, area_radius: int, entities: List[Entity]):
        self._clear_memories_for_area(point, area_radius)
        for entity in entities:
            self._data.append({
                'id': entity.id,
                'position': Point(entity.position.x, entity.position.y),
                'type': entity.type
            })

    def get_entities_data(self, entity_types: EntityTypes):
        result = []
        for entity_data in self._data:
            if (self._check_entity_data_type(entity_data, entity_types)):
                result.append(entity_data)

        return result
        
    
    def _clear_memories_for_area(self, point: Point, area_radius: int):
        memories_to_delete = []
        for entity_data in self._data:
            dist = math.dist([entity_data['position'].x, entity_data['position'].y], [point.x, point.y])
            if (dist <= area_radius):
                memories_to_delete.append(entity_data) 

        for memory_to_delete in memories_to_delete:
            self._data.remove(memory_to_delete)

    def _check_entity_data_type(self, entity_data: dict, types: List[EntityTypes]):
        for type in types:
            if (entity_data['type'] == type):
                return True
        
        return False
