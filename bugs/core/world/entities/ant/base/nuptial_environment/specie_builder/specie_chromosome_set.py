from .specie_chromosome import SpecieChromosome
from core.world.entities.ant.base.genetic.chromosomes_set import ChromosomesSet
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes
from typing import List

class SpecieChromosomeSet():

    @classmethod
    def build(self, specie_chromosomes: List[SpecieChromosome]):
        return SpecieChromosomeSet(specie_chromosomes)

    def __init__(self, specie_chromosomes: List[SpecieChromosome]):
        self._specie_chromosomes = specie_chromosomes

    @property
    def specie_chromosomes(self) -> List[SpecieChromosome]:
        return self._specie_chromosomes

    def accept_chromosome_set(self, chromosome_set: ChromosomesSet):
        for chromosome in chromosome_set.chromosomes:
            specie_chromosome = self._get_specie_chomosome_by_type(chromosome.type)
            specie_chromosome.accept_chromosome(chromosome)
    
    def generate_chorosome_set(self, percent: int, super_mutate_chance: int, super_mutate_percent: int) -> ChromosomesSet:
        generated_chromosomes = []
        for specie_chromosome in self._specie_chromosomes:
            generated_chromosomes.append(specie_chromosome.generate_chromosome(percent, super_mutate_chance, super_mutate_percent))

        return ChromosomesSet.build(generated_chromosomes)
    
    def _get_specie_chomosome_by_type(self, type: ChromosomeTypes):
        for specie_chromosome in self._specie_chromosomes:
            if specie_chromosome.type == type:
                return specie_chromosome
            
        return None