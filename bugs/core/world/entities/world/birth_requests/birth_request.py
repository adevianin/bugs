from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.base.entity import Entity
from abc import ABC
from typing import Callable, Any

class BirthRequest(ABC):

    def __init__(self, entity_type: EntityTypes, preborn_callback: Callable[[Entity], Any] = None, callback: Callable[[Entity], Any] = None):
        self._entity_type = entity_type
        self._preborn_callback = preborn_callback
        self._callback = callback

    @property
    def entity_type(self):
        return self._entity_type

    @property
    def preborn_callback(self):
        return self._preborn_callback
    
    @property
    def callback(self):
        return self._callback
    
