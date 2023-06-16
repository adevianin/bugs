from core.world.utils.event_emiter import EventEmitter
from .colony import Colony
from core.world.entities.map import Map

class ColonyFactory():

    def __init__(self, event_bus: EventEmitter, map: Map):
        self._event_bus = event_bus
        self._map = map

    def build_colony(self, id: int, owner_id: int):
        return Colony(id, self._event_bus, owner_id, self._map)