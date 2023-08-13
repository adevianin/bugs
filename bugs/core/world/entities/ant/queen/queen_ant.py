from core.world.entities.nest.nest import Nest
from ..base.ant import Ant
from ..base.ant_types import AntTypes
from core.world.utils.event_emiter import EventEmitter
from .queen_ant_body import QueenAntBody
from .queen_ant_mind import QueenAntMind

class QueenAnt(Ant):

    _mind: QueenAntMind
    _body: QueenAntBody

    MAX_HP = 300

    def __init__(self, events: EventEmitter, id: int, from_colony_id: int, mind: QueenAntMind, body: QueenAntBody):
        super().__init__(events, id, AntTypes.QUEEN, from_colony_id, mind, body)

    def ask_participation(self):
        once_relocated = self._body.memory.read('once_relocated')
        return not once_relocated

    def relocate_to_nest(self, nest: Nest):
        super().relocate_to_nest(nest)
        self._body.memory.save('once_relocated', True)
