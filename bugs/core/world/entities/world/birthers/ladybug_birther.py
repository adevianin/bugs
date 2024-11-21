from core.world.entities.ground_beetle.ground_beetle import GroundBeetle
from core.world.entities.map.map import Map
from core.world.id_generator import IdGenerator
from core.world.utils.event_emiter import EventEmitter
from .entity_birther import EntityBirther
from core.world.entities.ladybug.ladybug_factory import LadybugFactory
from .requests.ladybug_birth_request import LadybugBirthRequest

class LadybugBirther(EntityBirther):

    def __init__(self, event_bus: EventEmitter, id_generator: IdGenerator, map: Map, ladybug_factory: LadybugFactory):
        super().__init__(event_bus, id_generator, 'ladybug_birth_request', map)
        self._ladybug_factory = ladybug_factory

    def _build_entity(self, id, request: LadybugBirthRequest) -> GroundBeetle:
        return self._ladybug_factory.build_new_ladybug(id, request.position, 0)