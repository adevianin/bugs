from typing import List
from core.world.entities.ant.base.genetic.genes.base.base_gene import BaseGene
from .base.chromosomes_types import ChromosomesTypes
from .base.base_chromosome import BaseChromosome

class AdaptationChromosome(BaseChromosome):

    @classmethod
    def build(cls):
        return AdaptationChromosome()

    def __init__(self):
        super().__init__(ChromosomesTypes.ADAPTATION)

    def merge_genes(self, another_chromosome: 'AdaptationChromosome') -> List[BaseGene]:
        return []