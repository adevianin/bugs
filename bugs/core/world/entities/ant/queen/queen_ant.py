from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.ant.base.ant_mind import AntMind
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.utils.event_emiter import EventEmitter
from ..base.ant import Ant
from ..base.ant_types import AntTypes
from core.world.utils.event_emiter import EventEmitter
from .queen_ant_body import QueenAntBody
from .queen_ant_mind import QueenAntMind
from core.world.entities.ant.base.egg import Egg
from core.world.entities.action.ant_flew_nuptial_flight_action import AntFlewNuptialFlightAction
from core.world.entities.action.ant_flew_nuptial_flight_back_action import AntFlewNuptialFlightBackAction
from core.world.utils.point import Point
from core.world.entities.ant.base.nuptial_environment.nuptial_male import NuptialMale
from core.world.entities.action.ant_got_fertilized_action import AntGotFertilizedAction
from core.world.entities.base.ownership_config import OwnershipConfig
from core.world.entities.ant.base.genetic.genome import Genome

class QueenAnt(Ant):

    _mind: QueenAntMind
    _body: QueenAntBody
    body: QueenAntBody

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, name: str, ownership: OwnershipConfig, body: AntBody, mind: AntMind):
        super().__init__(event_bus, events, id, name, ownership, body, AntTypes.QUEEN, mind)

        self._body.events.add_listener('flew_nuptial_flight', self._on_flew_nuptial_flight)
        self._body.events.add_listener('flew_nuptial_flight_back', self._on_flew_nuptial_flight_back)

    @property
    def is_detectable(self):
        return super().is_detectable and not self._body.is_in_nuptial_flight

    @property
    def is_fertilized(self):
        return self._body.is_fertilized

    @property
    def can_fly_nuptial_flight(self):
        return not self._body.is_fertilized
    
    @property
    def is_queen_of_colony(self):
        return self._body.is_queen_of_colony
    
    @property
    def male_chromosomes_set(self):
        return self._body.male_chromosomes_set
    
    @property
    def is_in_nuptial_flight(self):
        return self._body.is_in_nuptial_flight
    
    @property
    def breeding_male_genome(self) -> Genome:
        return Genome.build(self._body.male_chromosomes_set, None) if self._body.is_fertilized else None
    
    def fly_nuptial_flight_back(self, landing_position: Point):
        self._mind.toggle_auto_thought_generation(True)
        self._body.fly_nuptial_flight_back(landing_position)

    def produce_egg(self, name: str, is_fertilized: bool) -> Egg:
        return self._body.produce_egg(name, is_fertilized)
    
    def fertilize(self, male: NuptialMale):
        self._body.fertilize(male.genome.maternal_chromosomes_set)
        self._emit_action(AntGotFertilizedAction(self.id, self.breeding_male_genome, self.owner_id))

    def do_step(self, step_number: int):
        if not self._body.is_in_nuptial_flight:
            super().do_step(step_number)
    
    def _on_flew_nuptial_flight(self):
        self._emit_action(AntFlewNuptialFlightAction.build(self.id))

    def _on_flew_nuptial_flight_back(self, landing_position: Point):
        self._emit_action(AntFlewNuptialFlightBackAction.build(self.id, landing_position))
    