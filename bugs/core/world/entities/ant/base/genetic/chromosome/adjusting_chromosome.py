from typing import List
from core.world.entities.ant.base.genetic.genes.base.base_gene import BaseGene
from core.world.entities.ant.base.genetic.chromosome.chromosomes_types import ChromosomesTypes
from .base_chromosome import BaseChromosome
from ..genes.adjusting_appetite_gene import AdjustingAppetiteGene
from ..genes.adjusting_development_appetite_gene import AdjustingDevelopmentAppetiteGene

class AdjustingChromosome(BaseChromosome):

    @classmethod
    def build(cls, appetite_gene: AdjustingAppetiteGene, development_appetite_gene: AdjustingDevelopmentAppetiteGene):
        return AdjustingChromosome(appetite_gene, development_appetite_gene)

    def __init__(self, appetite_gene: AdjustingAppetiteGene, development_appetite_gene: AdjustingDevelopmentAppetiteGene):
        super().__init__(ChromosomesTypes.ADJUSTING)
        self._appetite_gene = appetite_gene
        self._development_appetite_gene = development_appetite_gene

    @property
    def appetite_gene(self) -> AdjustingAppetiteGene:
        return self._appetite_gene

    @property
    def development_appetite_gene(self) -> AdjustingDevelopmentAppetiteGene:
        return self._development_appetite_gene
    
    def merge_genes(self, another_chromosome: 'AdjustingChromosome') -> List[BaseGene]:
        genes = []

        genes.append(self.appetite_gene.merge(another_chromosome.appetite_gene))
        genes.append(self.development_appetite_gene.merge(another_chromosome.development_appetite_gene))

        return genes