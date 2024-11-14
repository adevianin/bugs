from core.world.entities.map.map import Map
from core.world.id_generator import IdGenerator
from core.world.utils.event_emiter import EventEmitter
from .entity_birther import EntityBirther
from core.world.entities.ant.ant_factory import AntFactory
from core.world.entities.ant.base.ant import Ant
from .requests.ant_requests.ant_birth_request import AntBirthRequest
from core.world.entities.nest.nest import Nest
from core.world.entities.base.ownership_config import OwnershipConfig
from .requests.ant_requests.ant_birth_request_types import AntBirthRequestTypes
from .requests.ant_requests.ant_birth_from_nest_request import AntBirthFromNestRequest
from .requests.ant_requests.ant_birth_from_system_request import AntBirthFromSystemRequest
from core.world.utils.point import Point

class AntBirther(EntityBirther):

    def __init__(self, event_bus: EventEmitter, id_generator: IdGenerator, map: Map, ant_factory: AntFactory):
        super().__init__(event_bus, id_generator, 'ant_birth_request', map)
        self._ant_factory = ant_factory
        self._current_step = 0

        self._event_bus.add_listener('step_start', self._on_step_start)

    def _build_entity(self, id, request: AntBirthRequest) -> Ant:
        match(request.type):
            case AntBirthRequestTypes.FROM_NEST:
                return self._handle_ant_from_nest_request(id, request)
            case AntBirthRequestTypes.FROM_SYSTEM:
                return self._handle_ant_from_system_request(id, request)
            case _:
                raise Exception('unknown type of ant birth request')
    
    def _handle_ant_from_system_request(self, id: int, request: AntBirthFromSystemRequest):
        larva = request.larva
        ownership = OwnershipConfig(None, request.owner_id)
        return self._ant_factory.build_new_ant(id, larva.name, ownership, larva.genome, larva.ant_type, request.position, self._current_step, None)
    
    def _handle_ant_from_nest_request(self, id: int, request: AntBirthFromNestRequest):
        larva = request.larva
        nest: Nest = self._map.get_entity_by_id(request.nest_id)
        ownership = OwnershipConfig(nest.from_colony_id, nest.owner_id)
        return self._ant_factory.build_new_ant(id, larva.name, ownership, larva.genome, larva.ant_type, nest.position, self._current_step, nest)
        
    def _on_step_start(self, step_number: int, season):
        self._current_step = step_number