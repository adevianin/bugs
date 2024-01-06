from core.world.entities.ground_beetle.ground_beetle import GroundBeetle
from core.world.entities.world.birthers.requests.ground_beetle_birth_request import GroundBeetleBirthRequest
from core.world.entities.map.map import Map
from core.world.id_generator import IdGenerator
from core.world.utils.event_emiter import EventEmitter
from .entity_birther import EntityBirther
from core.world.entities.ground_beetle.ground_beetle_factory import GroundBeetleFactory

class GroundBeetleBirther(EntityBirther):

    def __init__(self, event_bus: EventEmitter, id_generator: IdGenerator, map: Map, ground_beetle_factory: GroundBeetleFactory):
        super().__init__(event_bus, id_generator, 'ground_beetle_birth_request', map)
        self._ground_beetle_factory = ground_beetle_factory

    def _build_entity(self, id, request: GroundBeetleBirthRequest) -> GroundBeetle:
        return self._ground_beetle_factory.build_new_ground_beetle(id, request.position)