from core.world.utils.event_emiter import EventEmitter
from .colony import Colony

class ColonyFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_colony(self, id: int, owner_id: int):
        return Colony(id, self._event_bus, owner_id)