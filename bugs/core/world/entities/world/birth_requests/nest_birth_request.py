from typing import Any, Callable
from core.world.entities.base.entity import Entity
from core.world.entities.base.entity_types import EntityTypes
from .birth_request import BirthRequest
from core.world.utils.point import Point

class NestBirthRequest(BirthRequest):

    def __init__(self, name: str, is_main: bool, position: Point, colony_id: int, owner_id: int, callback: Callable[[Entity], Any] = None):
        super().__init__(EntityTypes.NEST, None, callback)
        self._position = position
        self._colony_id = colony_id
        self._owner_id = owner_id
        self._name = name
        self._is_main = is_main

    @property
    def name(self):
        return self._name

    @property
    def is_main(self):
        return self._is_main

    @property
    def position(self):
        return self._position
    
    @property
    def colony_id(self):
        return self._colony_id
    
    @property
    def owner_id(self):
        return self._owner_id