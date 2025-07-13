from core.world.entities.ant.base.ant_stats import AntStats
from core.world.entities.base.live_entity.memory import Memory
from core.world.entities.base.live_entity.visual_sensor import VisualSensor
from core.world.entities.base.live_entity.temperature_sensor import TemperatureSensor
from core.world.entities.item.items.base.item import Item
from core.world.entities.nest.nest import Nest
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from ..base.ant_body import AntBody
from core.world.entities.ant.base.genetic.genome import Genome
from core.world.entities.ant.base.genetic.chromosomes_set import ChromosomesSet
from core.world.entities.ant.base.egg import Egg

class QueenAntBody(AntBody):

    class MemoryKeys(AntBody.MemoryKeys):
        IS_IN_NUPTIAL_FLIGHT = 'is_in_nuptial_flight'
        IS_QUEEN_OF_COLONY = 'is_queen_of_colony'
        IS_WINGS_REMOVED = 'is_wings_removed'

    def __init__(self, events: EventEmitter, stats: AntStats, sayer: EventEmitter, memory: Memory, position: Point, angle: int, hp: int, birth_step: int, calories: int, located_in_nest: Nest, 
                 picked_item: Item, visual_sensor: VisualSensor, temperature_sensor: TemperatureSensor, genome: Genome, male_chromosomes_set: ChromosomesSet):
        super().__init__(events, stats, sayer, memory, position, angle, hp, birth_step, calories, located_in_nest, picked_item, visual_sensor, temperature_sensor, genome)
        self._male_chromosomes_set = male_chromosomes_set

    @property
    def is_fertilized(self):
        return self._male_chromosomes_set is not None
    
    # @is_fertilized.setter
    # def is_fertilized(self, value: bool):
    #     self._is_fertilized = value
    
    @property
    def is_in_nuptial_flight(self):
        return self.memory.read_flag(self.MemoryKeys.IS_IN_NUPTIAL_FLIGHT)
    
    @property
    def is_queen_of_colony(self):
        return self.memory.read_flag(self.MemoryKeys.IS_QUEEN_OF_COLONY)
    
    @property
    def is_wings_removed(self):
        return self.memory.read_flag(self.MemoryKeys.IS_WINGS_REMOVED)
    
    @property
    def male_chromosomes_set(self):
        return self._male_chromosomes_set
    
    def fertilize(self, chromosome_set: ChromosomesSet):
        self._male_chromosomes_set = chromosome_set
        self.memory.save_flag(self.MemoryKeys.IS_QUEEN_OF_COLONY, True)

    def remove_wings(self):
        self.memory.save_flag(self.MemoryKeys.IS_WINGS_REMOVED, True)
        self.events.emit('wings_removed')
    
    def produce_egg(self, name: str, is_fertilized: bool) -> Egg:
        maternal_chromosome_set = self._genome.meiosis()
        male_chromosome_set = self._male_chromosomes_set if is_fertilized else None
        genome = Genome.build(maternal_chromosome_set, male_chromosome_set)
        return Egg.build_new(name, genome)
    
    def fly_nuptial_flight(self):
        super().fly_nuptial_flight()
        self.calories = self._max_calories
        self.memory.save_flag(self.MemoryKeys.IS_IN_NUPTIAL_FLIGHT, True)

    def fly_nuptial_flight_back(self, landing_position: Point):
        from_position = Point.generate_random_point_within_circle(landing_position, 400, 200)
        self._position = from_position
        self._look_at(landing_position)
        self.position = landing_position
        self.memory.save_flag(self.MemoryKeys.IS_IN_NUPTIAL_FLIGHT, False)
        self.events.emit('flew_nuptial_flight_back', self._position, from_position)