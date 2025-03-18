from core.world.utils.rectangle import Rectangle
from core.world.entities.base.entity import Entity
from core.world.settings import MAP_CHUNK_SIZE
from core.world.utils.point import Point
from typing import List

class Chunk():

    @staticmethod
    def build(position: Point):
        return Chunk(Rectangle(position, MAP_CHUNK_SIZE))

    def __init__(self, shape: Rectangle):
        self._shape = shape
        self._entities = set()

    @property
    def entities(self) -> List[Entity]:
        return list(self._entities)

    def contains_point(self, point: Point) -> bool:
        return self._shape.contains(point)
    
    def intersects(self, rectangle: Rectangle):
        return self._shape.intersects(rectangle)

    def contains_entity(self, entity: Entity) -> bool:
        return entity in self._entities

    def add_entity(self, entity: Entity):
        self._entities.add(entity)

    def remove_entity(self, entity: Entity):
        self._entities.remove(entity)
