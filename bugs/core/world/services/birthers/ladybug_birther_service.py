from .entity_birther_service import EntityBirtherService
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.ladybug.ladybug_factory import LadybugFactory
from core.world.entities.world.birth_requests.ladybug_birth_request import LadybugBirthRequest

class LadybugBirtherService(EntityBirtherService):
    
    def __init__(self, event_bus: EventEmitter, ladybug_factory: LadybugFactory):
        super().__init__(event_bus, 'ladybug_birth_request')
        self._ladybug_factory = ladybug_factory

    def _build_entity(self, request: LadybugBirthRequest):
        return self._ladybug_factory.build_new_ladybug(request.position, self._world.current_step)