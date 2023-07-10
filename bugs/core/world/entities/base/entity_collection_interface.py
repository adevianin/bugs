from abc import ABC, abstractclassmethod
from .entity import Entity
from typing import List
from core.world.entities.ant.base.ant_types import AntTypes

class iEntityCollection(ABC):

    @abstractclassmethod
    def add_entity(self, entity: Entity):
        pass

    @abstractclassmethod
    def delete_entity(self, id: int):
        pass

    @abstractclassmethod
    def get_entity_by_id(self, id: int) -> Entity:
        pass

    @abstractclassmethod
    def get_entities(self) -> List[Entity]:
        pass

    def get_ants_from_colony(self, colony_id: int, ant_type: AntTypes = None):
        pass