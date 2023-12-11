from typing import Any, Callable
from core.world.entities.base.entity import Entity
from core.world.entities.base.entity_types import EntityTypes
from .birth_request import BirthRequest
from core.world.utils.point import Point

class NestBirthRequest(BirthRequest):

    @classmethod
    def build(cls, position: Point, colony_id: int, callback: Callable[[Entity], Any] = None):
        return NestBirthRequest(position, colony_id, callback)

    def __init__(self, position: Point, colony_id: int, callback: Callable[[Entity], Any] = None):
        super().__init__(EntityTypes.NEST, None, callback)
        self._position = position
        self._colony_id = colony_id

    @property
    def position(self):
        return self._position
    
    @property
    def colony_id(self):
        return self._colony_id