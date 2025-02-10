from .entity_birther_service import EntityBirtherService
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.nest.nest_factory import NestFactory
from core.world.entities.base.ownership_config import OwnershipConfig
from core.world.entities.nest.nest import Nest
from core.world.entities.world.birth_requests.nest_birth_request import NestBirthRequest

class NestBirtherService(EntityBirtherService):
    
    def __init__(self, event_bus: EventEmitter, nest_factory: NestFactory):
        super().__init__(event_bus, 'nest_birth_request')
        self._nest_factory = nest_factory

    def _build_entity(self, request: NestBirthRequest) -> Nest:
        ownership = OwnershipConfig(request.colony_id, request.owner_id)
        return self._nest_factory.build_new_nest(request.position, ownership, request.name, request.is_main)