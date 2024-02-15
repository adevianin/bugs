from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.ant.base.genetic.genome import Genome

class Larva():

    @classmethod
    def build_new(cls, ant_type: AntTypes, genome: Genome):
        return Larva(ant_type, 0, genome)
    
    @classmethod
    def build(cls, ant_type: AntTypes, ate_calories: int, genome: Genome):
        return Larva(ant_type, ate_calories, genome)
    
    def __init__(self, ant_type: AntTypes, ate_calories: int, genome: Genome):
        self._ant_type = ant_type
        self._ate_calories = ate_calories
        self._genome = genome
        self._phenotype = self._genome.generate_phenotype(self._ant_type)
        self._required_food = self._calc_required_food()

    @property
    def ant_type(self):
        return self._ant_type

    @property
    def is_ready_to_born(self):
        return self.progress >= 100
    
    @property
    def ate_calories(self):
        return self._ate_calories
    
    @property
    def required_food(self):
        return self._required_food
    
    @property
    def genome(self) -> Genome:
        return self._genome

    @property
    def progress(self):
        return (100 / self._required_food) * self._ate_calories

    def feed(self, calories_count: int):
        self._ate_calories += calories_count

    def _calc_required_food(self):
        return 500
