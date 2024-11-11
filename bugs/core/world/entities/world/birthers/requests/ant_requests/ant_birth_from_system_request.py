from .ant_birth_request_types import AntBirthRequestTypes
from .ant_birth_request import AntBirthRequest
from core.world.entities.ant.base.larva import Larva
from core.world.utils.point import Point
from core.world.entities.base.entity import Entity
from typing import Callable, Any

class AntBirthFromSystemRequest(AntBirthRequest):

    def __init__(self, larva: Larva, owner_id: int, position: Point, preborn_callback: Callable[[Entity], Any] = None, callback: Callable[[Entity], Any] = None):
        super().__init__(AntBirthRequestTypes.FROM_SYSTEM, larva, preborn_callback, callback)
        self._owner_id = owner_id
        self._position = position

    @property
    def owner_id(self):
        return self._owner_id

    @property
    def position(self):
        return self._position

    @property
    def callback(self):
        return self._callback
    
   