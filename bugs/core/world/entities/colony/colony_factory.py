from core.world.utils.event_emiter import EventEmitter
from .colony import Colony
from core.world.entities.nest.nest import Nest
from core.world.entities.ant.base.ant import Ant

class ColonyFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_colony(self, id: int, owner_id: int, nests: list[Nest], ants: list[Ant]):
        return Colony(id, self._event_bus, owner_id, nests, ants)