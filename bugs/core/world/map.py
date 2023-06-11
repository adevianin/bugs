from .entities.base.entity import Entity
from .utils.size import Size
from .utils.point import Point
from .entities.base.entity_types import EntityTypes
from .entities.ant.base.ant_types import AntTypes

from typing import List
import random, math

class Map:

    @classmethod
    def build_map(cls, size: Size):
        return Map(size)

    def __init__(self, size: Size):
        self._size = size
        self._entities = {}

    def add_entity(self, entity: Entity):
        if entity.id == -1:
            entity.id = self._generate_entity_id()
        self._entities[entity.id] = entity

    def delete_entity(self, id: int):
        self._entities.pop(id)

    def get_entity_by_id(self, id: int) -> Entity:
        return self._entities[id]

    def get_entities(self) -> List[Entity]:
        return list(self._entities.values())

    def generate_random_point(self):
        x = random.randint(0, self._size.width)
        y = random.randint(0, self._size.height)
        
        return Point(x, y)

    def is_point_walkable(self, point: Point):
        is_x_valid = point.x >= 0 and point.x <= self._size.width
        is_y_valid = point.y >= 0 and point.y <= self._size.height

        return is_x_valid and is_y_valid

    def find_entities_near(self, point: Point, max_distance: int, entity_types: List[EntityTypes] = None):
        found_entities = []
        for entity in self.get_entities():
            dist = math.dist([entity.position.x, entity.position.y], [point.x, point.y])
            is_type_suitable = True if entity_types == None else self._check_entity_type(entity, entity_types)

            if (not entity.is_hidden and dist <= max_distance and is_type_suitable):
                found_entities.append(entity)

        return found_entities
    
    def get_entities_from_town(self, town_id: int):
        found_entities = []
        for entity in self.get_entities():
            if hasattr(entity, 'located_in_town_id') and entity.located_in_town_id == town_id:
                found_entities.append(entity)

        return found_entities
    
    def get_ants_owned_by(self, owner_id: int, ant_type: AntTypes = None):
        found_ants = []
        for entity in self.get_entities():
            if entity.type == EntityTypes.ANT and entity.owner_id == owner_id and (ant_type == None or entity.ant_type == ant_type):
                found_ants.append(entity)

        return found_ants
    
    @property
    def size(self):
        return self._size
    
    def _check_entity_type(self, entity: Entity, entity_types: EntityTypes):
        for type in entity_types:
            if (entity.type == type):
                return True
            
        return False
    
    def _generate_entity_id(self):
        max_id = 0
        for entity in self.get_entities():
            if entity.id > max_id:
                max_id = entity.id
        
        return max_id + 1

