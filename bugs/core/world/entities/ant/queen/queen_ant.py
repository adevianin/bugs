from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.ant.base.ant_mind import AntMind
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.nest.nest import Nest
from ..base.ant import Ant
from ..base.ant_types import AntTypes
from core.world.utils.event_emiter import EventEmitter
from .queen_ant_body import QueenAntBody
from .queen_ant_mind import QueenAntMind

class QueenAnt(Ant):

    _mind: QueenAntMind
    _body: QueenAntBody

    def __init__(self, events: EventEmitter, id: int, from_colony_id: int, body: AntBody, mind: AntMind):
        super().__init__(events, id, from_colony_id, body, AntTypes.QUEEN, mind)

    def ask_participation(self):
        once_relocated = self._body.memory.read('once_relocated')
        return not once_relocated

    def relocate_to_nest(self, nest: Nest):
        super().relocate_to_nest(nest)
        self._body.memory.save('once_relocated', True)
