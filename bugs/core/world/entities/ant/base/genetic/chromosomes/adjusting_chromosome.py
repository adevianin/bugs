from typing import List
from core.world.entities.ant.base.genetic.phenotype import Phenotype
from core.world.entities.ant.base.genetic.genes.base.base_gene import BaseGene
from .base.chromosomes_types import ChromosomesTypes
from .base.base_chromosome import BaseChromosome
from ..genes.adjusting_appetite_gene import AdjustingAppetiteGene
from ..genes.adjusting_development_appetite_gene import AdjustingDevelopmentAppetiteGene

class AdjustingChromosome(BaseChromosome):

    @classmethod
    def build(cls, appetite_gene: AdjustingAppetiteGene, development_appetite_gene: AdjustingDevelopmentAppetiteGene):
        return AdjustingChromosome(appetite_gene, development_appetite_gene)

    def __init__(self, appetite_gene: AdjustingAppetiteGene, development_appetite_gene: AdjustingDevelopmentAppetiteGene):
        super().__init__(ChromosomesTypes.ADJUSTING)
        self.appetite_gene = appetite_gene
        self.development_appetite_gene = development_appetite_gene

    def merge(self, another_chromosome: 'AdjustingChromosome') -> 'AdjustingChromosome':
        appetite_gene = self.appetite_gene.merge(another_chromosome.appetite_gene)
        development_appetite_gene = self.development_appetite_gene.merge(another_chromosome.development_appetite_gene)
        return AdjustingChromosome.build(appetite_gene, development_appetite_gene)
    
    def affect_phenotype(self, phenotype: Phenotype):
        self.appetite_gene.affect(phenotype)
        self.development_appetite_gene.affect(phenotype)
    