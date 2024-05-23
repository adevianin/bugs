from core.world.entities.base.entity import Entity
from typing import List, Callable
from core.world.entities.base.entity_types import EntityTypes
from core.world.utils.size import Size
from core.world.utils.point import Point

class VisualSensor():

    def __init__(self):
        self._nearby_entities = []

    def set_map_size(self, map_size: Size):
        self._map_size = map_size

    def can_walk_to(self, point: Point):
        is_x_walkable = point.x >= 0 and point.x <= self._map_size.width
        is_y_walkable = point.y >= 0 and point.y <= self._map_size.height

        return is_x_walkable and is_y_walkable
    
    def set_nearby_entities(self, entities: List[Entity]):
        self._nearby_entities = entities

    def get_nearby_entities(self, types_list: List[EntityTypes] = None, filter: Callable = None):
        res = []
        for entity in self._nearby_entities:
            if (not types_list or entity.type in types_list) and (not filter or filter(entity)):
                res.append(entity)

        return res