from core.world.entities.base.entity_types import EntityTypes
from .birth_request import BirthRequest
from core.world.utils.point import Point

class GroundBeetleBirthRequest(BirthRequest):

    @classmethod
    def build(cls, position: Point):
        return GroundBeetleBirthRequest(position)

    def __init__(self, position: Point):
        super().__init__(EntityTypes.GROUND_BEETLE)
        self._position = position

    @property
    def position(self):
        return self._position