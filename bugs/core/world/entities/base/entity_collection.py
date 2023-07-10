from .entity_collection_interface import iEntityCollection
from typing import List
from .entity import Entity
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.base.entity_types import EntityTypes

class EntityCollection(iEntityCollection):

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

    def get_entities(self) -> List[Entity]:
        return list(self._entities.values())
    