from core.world.utils.event_emiter import EventEmitter
from core.world.entities.ant.ant_factory import AntFactory
from core.world.entities.ant.base.larva import Larva
from core.world.entities.nest.nest import Nest
from core.world.entities.map.map import Map

class AntBirther():

    def __init__(self, event_bus: EventEmitter, ant_factory: AntFactory):
        self._event_bus = event_bus
        self._ant_factory = ant_factory

        self._event_bus.add_listener('ant_birth_request', self._on_ant_birth_request)

    def set_map(self, map: Map):
        self._map = map

    def _on_ant_birth_request(self, larva: Larva, nest: Nest):
        new_ant = self._ant_factory.build_ant(None, nest.from_colony, larva.ant_type, larva.dna_profile, nest.position, nest, None, None, None, True, False)
        self._map.add_new_entity(new_ant)
        new_ant.born()