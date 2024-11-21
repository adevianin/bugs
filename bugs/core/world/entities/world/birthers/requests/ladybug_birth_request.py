from core.world.entities.base.entity_types import EntityTypes
from .birth_request import BirthRequest
from core.world.utils.point import Point

class LadybugBirthRequest(BirthRequest):

    def __init__(self, position: Point):
        super().__init__(EntityTypes.LADYBUG)
        self._position = position

    @property
    def position(self):
        return self._position