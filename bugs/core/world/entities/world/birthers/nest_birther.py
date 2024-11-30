from core.world.entities.nest.nest import Nest
from core.world.entities.world.birthers.requests.nest_birth_request import NestBirthRequest
from core.world.entities.map.map import Map
from core.world.id_generator import IdGenerator
from core.world.utils.event_emiter import EventEmitter
from .entity_birther import EntityBirther
from core.world.entities.nest.nest_factory import NestFactory
from core.world.entities.base.ownership_config import OwnershipConfig

class NestBirther(EntityBirther):

    def __init__(self, event_bus: EventEmitter, id_generator: IdGenerator, map: Map, nest_factory: NestFactory):
        super().__init__(event_bus, id_generator, 'nest_birth_request', map)
        self._nest_factory = nest_factory

    def _build_entity(self, id, request: NestBirthRequest) -> Nest:
        ownership = OwnershipConfig(request.colony_id, request.owner_id)
        return self._nest_factory.build_new_nest(id, request.position, ownership, request.name, request.is_main)