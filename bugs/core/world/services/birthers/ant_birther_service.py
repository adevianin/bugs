from .entity_birther_service import EntityBirtherService
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.ant.ant_factory import AntFactory
from core.world.entities.world.birth_requests.ant_requests.ant_birth_request import AntBirthRequest
from core.world.entities.world.birth_requests.ant_requests.ant_birth_from_nest_request import AntBirthFromNestRequest
from core.world.entities.world.birth_requests.ant_requests.ant_birth_from_system_request import AntBirthFromSystemRequest
from core.world.entities.world.birth_requests.ant_requests.ant_birth_request_types import AntBirthRequestTypes
from core.world.entities.ant.base.ant import Ant
from core.world.entities.base.ownership_config import OwnershipConfig
from core.world.entities.nest.nest import Nest
from core.world.exceptions import GameError

class AntBirtherService(EntityBirtherService):

    def __init__(self, event_bus: EventEmitter, ant_factory: AntFactory):
        super().__init__(event_bus, 'ant_birth_request')
        self._ant_factory = ant_factory

    def _build_entity(self, request: AntBirthRequest) -> Ant:
        match(request.type):
            case AntBirthRequestTypes.FROM_NEST:
                return self._handle_ant_from_nest_request(request)
            case AntBirthRequestTypes.FROM_SYSTEM:
                return self._handle_ant_from_system_request(request)
            case _:
                raise GameError('unknown type of ant birth request')
    
    def _handle_ant_from_system_request(self, request: AntBirthFromSystemRequest):
        larva = request.larva
        ownership = OwnershipConfig(None, request.owner_id)
        return self._ant_factory.build_new_ant(larva.name, ownership, larva.genome, larva.ant_type, request.position, self._world.current_step, None)
    
    def _handle_ant_from_nest_request(self,request: AntBirthFromNestRequest):
        larva = request.larva
        nest: Nest = self._world.map.get_entity_by_id(request.nest_id)
        ownership = OwnershipConfig(nest.from_colony_id, nest.owner_id)
        return self._ant_factory.build_new_ant(larva.name, ownership, larva.genome, larva.ant_type, nest.position, self._world.current_step, nest)