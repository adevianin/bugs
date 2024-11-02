from core.world.entities.base.entity_types import EntityTypes
from ..birth_request import BirthRequest
from core.world.entities.ant.base.larva import Larva
from .ant_birth_request_types import AntBirthRequestTypes

class AntBirthRequest(BirthRequest):

    def __init__(self, type: AntBirthRequestTypes, larva: Larva):
        super().__init__(EntityTypes.ANT)
        self._type = type
        self._larva = larva

    @property
    def type(self):
        return self._type

    @property
    def larva(self):
        return self._larva