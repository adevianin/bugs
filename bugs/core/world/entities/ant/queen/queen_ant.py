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
from core.world.entities.ant.base.larva import Larva
from core.world.entities.action.ant_flew_nuptial_flight_action import AntFlewNuptialFlightAction

class QueenAnt(Ant):

    _mind: QueenAntMind
    _body: QueenAntBody
    body: QueenAntBody

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, from_colony_id: int, body: AntBody, mind: AntMind):
        super().__init__(event_bus, events, id, from_colony_id, body, AntTypes.QUEEN, mind)

        self._body.events.add_listener('flew_nuptial_flight', self._on_flew_nuptial_flight)

    def produce_larva(self, ant_type: AntTypes) -> Larva:
        return self._body.produce_larva(ant_type)
    
    def _on_flew_nuptial_flight(self):
        self._emit_action(AntFlewNuptialFlightAction.build(self.id))
    