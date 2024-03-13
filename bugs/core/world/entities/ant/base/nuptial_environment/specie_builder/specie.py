from .specie_chromosome_set import SpecieChromosomeSet
from core.world.entities.ant.base.genetic.genome import Genome

class Specie():

    @classmethod
    def build(self, chromosome_set: SpecieChromosomeSet):
        return Specie(chromosome_set)

    def __init__(self, chromosome_set: SpecieChromosomeSet):
        self._chromosome_set = chromosome_set

    @property
    def specie_chromosome_set(self) -> SpecieChromosomeSet:
        return self._chromosome_set
    
    def accept_male_genome(self, genome: Genome):
        maternal_chromosome_set = genome.maternal_chromosomes_set
        self._chromosome_set.accept_chromosome_set(maternal_chromosome_set)
    
    def generate_male_genome(self, percent: int, super_mutate_chance: int, super_mutate_percent: int) -> Genome:
        maternal_chromosome = self._chromosome_set.generate_chorosome_set(percent, super_mutate_chance, super_mutate_percent)
        return Genome.build(maternal_chromosome, None)
    

    
