from ..base.ant import Ant
from ..base.ant_types import AntTypes
from core.world.utils.event_emiter import EventEmitter
from .queen_ant_body import QueenAntBody
from .queen_ant_mind import QueenAntMind
from core.world.entities.nest.nest import Nest

class QueenAnt(Ant):

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, from_colony: int, mind: QueenAntMind, body: QueenAntBody, is_in_operation: bool):
        super().__init__(event_bus, events, id, AntTypes.QUEEN, from_colony, mind, body, is_in_operation)

    def build_new_nest(self, new_nest: Nest, sayback: str):
        self._mind.build_new_nest(new_nest, sayback)
    