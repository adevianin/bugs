from typing import List
from core.world.entities.ant.base.genetic.genes.base.base_gene import BaseGene
from core.world.entities.ant.base.genetic.chromosome.chromosomes_types import ChromosomesTypes
from .base_chromosome import BaseChromosome

class BuildingChromosome(BaseChromosome):

    @classmethod
    def build(cls):
        return BuildingChromosome()

    def __init__(self):
        super().__init__(ChromosomesTypes.BUILDING)

    def merge_genes(self, another_chromosome: 'BuildingChromosome') -> List[BaseGene]:
        return []