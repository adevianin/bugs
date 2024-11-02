from .ant_birth_request_types import AntBirthRequestTypes
from .ant_birth_request import AntBirthRequest
from core.world.entities.ant.base.larva import Larva

class AntBirthFromNestRequest(AntBirthRequest):

    def __init__(self, larva: Larva, nest_id: int):
        super().__init__(AntBirthRequestTypes.FROM_NEST, larva)
        self._nest_id = nest_id

    @property
    def nest_id(self):
        return self._nest_id
    
   