from core.world.entities.map.map import Map
from core.world.utils.event_emiter import EventEmitter
from .entity_birther import EntityBirther
from core.world.entities.ladybug.ladybug_factory import LadybugFactory
from .requests.ladybug_birth_request import LadybugBirthRequest

class LadybugBirther(EntityBirther):

    def __init__(self, event_bus: EventEmitter, map: Map, ladybug_factory: LadybugFactory):
        super().__init__(event_bus, 'ladybug_birth_request', map)
        self._ladybug_factory = ladybug_factory

    def _build_entity(self, request: LadybugBirthRequest):
        return self._ladybug_factory.build_new_ladybug(request.position, 0)