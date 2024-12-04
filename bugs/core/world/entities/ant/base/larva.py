from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.ant.base.genetic.genome import Genome
from core.world.id_generator import IdGenerator

class Larva():

    @classmethod
    def build_new(cls, name: str, ant_type: AntTypes, genome: Genome):
        id = IdGenerator.generate_id()
        return Larva.build(id, name, ant_type, 0, genome)
    
    @classmethod
    def build(cls, id: int, name: str, ant_type: AntTypes, ate_food: int, genome: Genome):
        return Larva(id, name, ant_type, ate_food, genome)
    
    def __init__(self, id: int, name: str, ant_type: AntTypes, ate_food: int, genome: Genome):
        self._id = id
        self._name = name
        self._ant_type = ant_type
        self._ate_food = ate_food
        self._genome = genome
        self._phenotype = self._genome.generate_phenotype(self._ant_type)

    @property
    def id(self):
        return self._id

    @property
    def name(self):
        return self._name

    @property
    def ant_type(self):
        return self._ant_type

    @property
    def is_ready_to_born(self):
        return self._ate_food >= self._phenotype.required_food
    
    @property
    def ate_food(self):
        return self._ate_food
    
    @property
    def required_food(self):
        return self._phenotype.required_food
    
    @property
    def genome(self) -> Genome:
        return self._genome
    
    @property
    def is_died(self):
        return self.ate_food < 0

    def feed(self, food_count: int):
        if self.is_died:
            return
        
        if food_count == 0:
            self._die()
            return
        
        if self._ate_food + food_count > self._phenotype.required_food:
            self._ate_food = self._phenotype.required_food
        else:
            self._ate_food += food_count

    def _die(self):
        self._ate_food = -1
