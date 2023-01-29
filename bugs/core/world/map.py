from .entities.base.entity import Entity
from .utils.size import Size
from .utils.point import Point
from typing import List
import random

class Map:

    def __init__(self, size: Size):
        self._size = size
        self._entities = {}

    def add_entity(self, entity: Entity):
        if not entity.id:
            entity.id = self._generate_id()
        self._entities[entity.id] = entity

    def get_entity_by_id(self, id: int) -> Entity:
        return self._entities[id]

    def get_entities(self) -> List[Entity]:
        return self._entities.values()

    def generate_random_point(self):
        x = random.randint(0, self._size.width)
        y = random.randint(0, self._size.height)
        
        return Point(x, y)

    def is_point_walkable(self, point: Point):
        is_x_valid = point.x >= 0 and point.x <= self._size.width
        is_y_valid = point.y >= 0 and point.y <= self._size.height

        return is_x_valid and is_y_valid

    def _generate_id(self):
        ids = self._entities.keys
        last_id = 0
        for id in ids:
            if id > last_id:
                last_id = id
                
        return last_id + 1


