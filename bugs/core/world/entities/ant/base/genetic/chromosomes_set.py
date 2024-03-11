from .genes.base.base_gene import BaseGene
from .chromosome import Chromosome
from typing import List

class ChromosomesSet():

    @classmethod
    def build(cls, body: Chromosome, development: Chromosome, adaptation: Chromosome, building: Chromosome, combat: Chromosome, adjusting: Chromosome):
        return ChromosomesSet(body, development, adaptation, building, combat, adjusting)

    def __init__(self, body: Chromosome, development: Chromosome, adaptation: Chromosome, building: Chromosome, combat: Chromosome, adjusting: Chromosome):
        self._body_chromosome = body
        self._development_chromosome = development
        self._adaptation_chromosome = adaptation
        self._building_chromosome = building
        self._combat_chromosome = combat
        self._adjusting_chromosome = adjusting

    @property
    def body_chromosome(self) -> Chromosome:
        return self._body_chromosome
    
    @property
    def development_chromosome(self) -> Chromosome:
        return self._development_chromosome
    
    @property
    def adaptation_chromosome(self) -> Chromosome:
        return self._adaptation_chromosome
    
    @property
    def building_chromosome(self) -> Chromosome:
        return self._building_chromosome
    
    @property
    def combat_chromosome(self) -> Chromosome:
        return self._combat_chromosome
    
    @property
    def adjusting_chromosome(self) -> Chromosome:
        return self._adjusting_chromosome
    
    def get_genes(self) -> List[BaseGene]:
        genes = []
        genes += self._body_chromosome.genes
        genes += self._development_chromosome.genes
        genes += self._adaptation_chromosome.genes
        genes += self._building_chromosome.genes
        genes += self._combat_chromosome.genes
        genes += self._adjusting_chromosome.genes

        return genes
    
    def mutate(self, percent: int, super_mutate_chance: int, super_mutate_percent: int) -> 'ChromosomesSet':
        body = self._body_chromosome.mutate(percent, super_mutate_chance, super_mutate_percent)
        development = self._development_chromosome.mutate(percent, super_mutate_chance, super_mutate_percent)
        adaptation = self._adaptation_chromosome.mutate(percent, super_mutate_chance, super_mutate_percent)
        building = self._building_chromosome.mutate(percent, super_mutate_chance, super_mutate_percent)
        combat = self._combat_chromosome.mutate(percent, super_mutate_chance, super_mutate_percent)
        adjusting = self._adjusting_chromosome.mutate(percent, super_mutate_chance, super_mutate_percent)
        return ChromosomesSet.build(body, development, adaptation, building, combat, adjusting)
    