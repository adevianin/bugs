from typing import List
from core.world.entities.ant.base.genetic.genes.base.base_gene import BaseGene
from .base.chromosomes_types import ChromosomesTypes
from .base.base_chromosome import BaseChromosome

class CombatChromosome(BaseChromosome):

    @classmethod
    def build(cls):
        return CombatChromosome()

    def __init__(self):
        super().__init__(ChromosomesTypes.COMBAT)

    def merge_genes(self, another_chromosome: 'CombatChromosome') -> List[BaseGene]:
        return []