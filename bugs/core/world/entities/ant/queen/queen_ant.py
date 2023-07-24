from ..base.ant import Ant
from ..base.ant_types import AntTypes
from core.world.utils.event_emiter import EventEmitter
from .queen_ant_body import QueenAntBody
from .queen_ant_mind import QueenAntMind
from core.world.utils.point import Point

class QueenAnt(Ant):

    _mind: QueenAntMind
    _body: QueenAntBody

    def __init__(self, events: EventEmitter, id: int, from_colony: int, mind: QueenAntMind, body: QueenAntBody, is_in_operation: bool):
        super().__init__(events, id, AntTypes.QUEEN, from_colony, mind, body, is_in_operation)
