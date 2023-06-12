from ..base.ant import Ant
from ..base.ant_types import AntTypes
from core.world.utils.event_emiter import EventEmitter
from .queen_ant_body import QueenAntBody
from .queen_ant_mind import QueenAntMind
from core.world.entities.nest.nest import Nest

class QueenAnt(Ant):

    def __init__(self, event_bus: EventEmitter, id: int, owner_id: int, mind: QueenAntMind, body: QueenAntBody):
        super().__init__(event_bus, id, AntTypes.QUEEN, owner_id, mind, body)

    def build_new_nest(self, new_nest: Nest):
        return self._mind.build_new_nest(new_nest)