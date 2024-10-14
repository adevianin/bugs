from core.world.entities.map.map import Map
from core.world.id_generator import IdGenerator
from core.world.utils.event_emiter import EventEmitter
from .entity_birther import EntityBirther
from core.world.entities.ant.ant_factory import AntFactory
from core.world.entities.ant.base.ant import Ant
from .requests.ant_birth_request import AntBirthRequest
from core.world.entities.nest.nest import Nest

class AntBirther(EntityBirther):

    def __init__(self, event_bus: EventEmitter, id_generator: IdGenerator, map: Map, ant_factory: AntFactory):
        super().__init__(event_bus, id_generator, 'ant_birth_request', map)
        self._ant_factory = ant_factory

    def _build_entity(self, id, request: AntBirthRequest) -> Ant:
        larva = request.larva
        nest: Nest = self._map.get_entity_by_id(request.nest_id)
        return self._ant_factory.build_new_ant(id, larva.name, nest.from_colony_id, nest.owner_id, larva.genome, larva.ant_type, nest.position, 101, nest)
        