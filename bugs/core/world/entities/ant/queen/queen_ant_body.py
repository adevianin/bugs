from core.world.entities.base.live_entity.live_stats import LiveStats
from core.world.entities.base.live_entity.memory import Memory
from core.world.entities.base.live_entity.world_interactor import WorldInteractor
from core.world.entities.item.items.base.item import Item
from core.world.entities.nest.nest import Nest
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from ..base.ant_body import AntBody
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.ant.base.larva import Larva
from core.world.entities.ant.base.genetic.genome import Genome
from core.world.entities.ant.base.genetic.chromosomes_set import ChromosomesSet

class QueenAntBody(AntBody):

    def __init__(self, events: EventEmitter, stats: LiveStats, sayer: EventEmitter, memory: Memory, position: Point, angle: int, hp: int, located_in_nest: Nest, picked_item: Item, 
                 world_interactor: WorldInteractor, genome: Genome, male_chromosomes_set: ChromosomesSet, is_in_nuptial_flight: bool):
        super().__init__(events, stats, sayer, memory, position, angle, hp, located_in_nest, picked_item, world_interactor, genome)
        self._male_chromosomes_set = male_chromosomes_set
        self._is_in_nuptial_flight = is_in_nuptial_flight

    @property
    def is_fertilized(self):
        return self._male_chromosomes_set is not None
    
    # @is_fertilized.setter
    # def is_fertilized(self, value: bool):
    #     self._is_fertilized = value
    
    @property
    def is_in_nuptial_flight(self):
        return self._is_in_nuptial_flight
    
    @property
    def can_fly_nuptial_flight(self):
        return not self.is_fertilized
    
    @property
    def male_chromosomes_set(self):
        return self._male_chromosomes_set
    
    def produce_larva(self, ant_type: AntTypes) -> Larva:
        maternal_chromosome_set = self._genome.meiosis()
        genome = Genome.build(maternal_chromosome_set, self._male_chromosomes_set)
        return Larva.build_new(ant_type, genome)
    
    def fly_nuptial_flight(self):
        if self.is_in_nest:
            self.get_out_of_nest()
        
        self._is_in_nuptial_flight = True
        self.events.emit('flew_nuptial_flight')

    def fly_nuptial_flight_back(self, landing_position: Point):
        self._position = landing_position
        self._is_in_nuptial_flight = False
        self.events.emit('flew_nuptial_flight_back', self._position)