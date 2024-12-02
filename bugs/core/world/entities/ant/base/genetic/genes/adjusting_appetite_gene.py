from .base.genes_types import GenesTypes
from .base.base_gene import BaseGene
from core.world.entities.ant.base.genetic.phenotype import Phenotype
from .base.domination_codes import DominationCodes
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes

class AdjustingAppetiteGene(BaseGene):

    @classmethod
    def build(cls, domination_code: DominationCodes):
        return AdjustingAppetiteGene(domination_code)
    
    @staticmethod
    def build_new_for_specie_gene():
        return AdjustingAppetiteGene.build(DominationCodes.random())

    def __init__(self, domination_code: DominationCodes):
        super().__init__(GenesTypes.ADJUSTING_APPETITE, ChromosomeTypes.ADJUSTING, domination_code)

    def affect(self, phenotype: Phenotype):
        phenotype.appetite = phenotype.strength + phenotype.defense + phenotype.speed/2

    def merge(self, another_gene: 'AdjustingAppetiteGene') -> BaseGene:
        dominating_gene = super().merge(another_gene)
        return dominating_gene or another_gene
    
    def mutate(self, percent: int, super_mutate_chance: int, super_mutate_percent: int) -> BaseGene:
        return AdjustingAppetiteGene.build(DominationCodes.random())
    
    def upgrade(self) -> 'AdjustingAppetiteGene':
        return AdjustingAppetiteGene.build(DominationCodes.random())
        