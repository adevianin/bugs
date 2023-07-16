from core.world.utils.event_emiter import EventEmitter
from core.world.entities.nest.nest_factory import NestFactory
from core.world.entities.map.map import Map
from core.world.utils.point import Point

class NestBirther():

    def __init__(self, event_bus: EventEmitter, nest_factory: NestFactory):
        self._event_bus = event_bus
        self._nest_factory = nest_factory

        self._event_bus.add_listener('nest_birth_request', self._on_nest_birth_request)

    def set_map(self, map: Map):
        self._map = map

    def _on_nest_birth_request(self, nest_position: Point, from_colony_id: int, callback):
        new_nest = self._nest_factory.build_new_nest(nest_position, from_colony_id)
        self._map.add_new_entity(new_nest)
        new_nest.born()
        callback(new_nest)