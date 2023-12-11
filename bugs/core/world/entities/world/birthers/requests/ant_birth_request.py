from core.world.entities.base.entity_types import EntityTypes
from .birth_request import BirthRequest
from core.world.entities.ant.base.larva import Larva

class AntBirthRequest(BirthRequest):

    @classmethod
    def build(cls, nest_id: int, larva: Larva):
        return AntBirthRequest(nest_id, larva)

    def __init__(self, nest_id: int, larva: Larva):
        super().__init__(EntityTypes.ANT)
        self._nest_id = nest_id
        self._larva = larva

    @property
    def nest_id(self):
        return self._nest_id
    
    @property
    def larva(self):
        return self._larva