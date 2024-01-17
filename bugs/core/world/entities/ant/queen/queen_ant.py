from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.ant.base.ant_mind import AntMind
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.utils.event_emiter import EventEmitter
from ..base.ant import Ant
from ..base.ant_types import AntTypes
from core.world.utils.event_emiter import EventEmitter
from .queen_ant_body import QueenAntBody
from .queen_ant_mind import QueenAntMind
from core.world.entities.ant.base.larva import Larva
from core.world.entities.action.ant_flew_nuptial_flight_action import AntFlewNuptialFlightAction
from core.world.entities.action.ant_flew_nuptial_flight_back_action import AntFlewNuptialFlightBackAction
from core.world.utils.point import Point
from core.world.entities.ant.base.nuptial_environment.nuptial_male import NuptialMale

class QueenAnt(Ant):

    _mind: QueenAntMind
    _body: QueenAntBody
    body: QueenAntBody

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, from_colony_id: int, owner_id: int, body: AntBody, mind: AntMind):
        super().__init__(event_bus, events, id, from_colony_id, owner_id, body, AntTypes.QUEEN, mind)

        self._body.events.add_listener('flew_nuptial_flight', self._on_flew_nuptial_flight)
        self._body.events.add_listener('flew_nuptial_flight_back', self._on_flew_nuptial_flight_back)

    @property
    def can_fly_nuptial_flight(self):
        return self._body.can_fly_nuptial_flight
    
    def fly_nuptial_flight(self):
        self._mind.free_mind()
        self._mind.toggle_auto_thought_generation(False)
        self._body.fly_nuptial_flight()

    def fly_nuptial_flight_back(self, landing_position: Point):
        self._mind.toggle_auto_thought_generation(True)
        self._body.fly_nuptial_flight_back(landing_position)

    def produce_larva(self, ant_type: AntTypes) -> Larva:
        return self._body.produce_larva(ant_type)
    
    def fertilize(self, male: NuptialMale):
        self._body.genes.cross(male.genes)
        self._body.is_fertilized = True
    
    def _on_flew_nuptial_flight(self):
        self._emit_action(AntFlewNuptialFlightAction.build(self.id))

    def _on_flew_nuptial_flight_back(self, landing_position: Point):
        self._emit_action(AntFlewNuptialFlightBackAction.build(self.id, landing_position))
    