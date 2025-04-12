from core.world.utils.rectangle import Rectangle
from core.world.entities.base.entity import Entity
from core.world.entities.base.entity_types import EntityTypes
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
        self._entities_by_types = {}

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
        type_pack: List = self._entities_by_types.get(entity.type, [])
        type_pack.append(entity)
        self._entities_by_types[entity.type] = type_pack

    def remove_entity(self, entity: Entity):
        self._entities.remove(entity)
        type_pack: List = self._entities_by_types[entity.type]
        type_pack.remove(entity)

    def get_entities_by_types(self, entity_types: List[EntityTypes]) -> List[Entity]:
        entities = []
        for entity_type in entity_types:
            entities += self._entities_by_types.get(entity_type, [])
        return entities
