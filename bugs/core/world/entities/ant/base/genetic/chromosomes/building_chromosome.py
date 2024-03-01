from typing import List
from core.world.entities.ant.base.genetic.phenotype import Phenotype
from core.world.entities.ant.base.genetic.genes.base.base_gene import BaseGene
from .base.chromosomes_types import ChromosomesTypes
from .base.base_chromosome import BaseChromosome

class BuildingChromosome(BaseChromosome):

    @classmethod
    def build(cls):
        return BuildingChromosome()

    def __init__(self):
        super().__init__(ChromosomesTypes.BUILDING)

    def merge(self, another_chromosome: 'BuildingChromosome') -> 'BuildingChromosome':
        return BuildingChromosome.build()
    
    def affect_phenotype(self, phenotype: Phenotype):
        return