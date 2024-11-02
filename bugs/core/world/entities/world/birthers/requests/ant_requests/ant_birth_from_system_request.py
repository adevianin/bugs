from .ant_birth_request_types import AntBirthRequestTypes
from .ant_birth_request import AntBirthRequest
from core.world.entities.ant.base.larva import Larva
from core.world.utils.point import Point

from typing import Callable

class AntBirthFromSystemRequest(AntBirthRequest):

    def __init__(self, larva: Larva, owner_id: int, position: Point, callback: Callable):
        super().__init__(AntBirthRequestTypes.FROM_SYSTEM, larva)
        self._owner_id = owner_id
        self._position = position
        self._callback = callback

    @property
    def owner_id(self):
        return self._owner_id

    @property
    def position(self):
        return self._position

    @property
    def callback(self):
        return self._callback
    
   