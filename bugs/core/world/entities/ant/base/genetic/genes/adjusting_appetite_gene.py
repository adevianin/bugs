from .base.genes_types import GenesTypes
from .base.base_gene import BaseGene
from core.world.entities.ant.base.genetic.phenotype import Phenotype
from .base.domination_codes import DominationCodes
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes
import random

class AdjustingAppetiteGene(BaseGene):

    MULTIPLIER_NDIGITS = 2

    @classmethod
    def build(cls, domination_code: DominationCodes, multiplier: float):
        return AdjustingAppetiteGene(domination_code, multiplier)

    @classmethod
    def build_new_for_specie_gene(cls):
        return AdjustingAppetiteGene.build(DominationCodes.random(), round(random.uniform(0.9, 1.1), cls.MULTIPLIER_NDIGITS))

    def __init__(self, domination_code: DominationCodes, multiplier: float):
        super().__init__(GenesTypes.ADJUSTING_APPETITE, ChromosomeTypes.ADJUSTING, domination_code)
        self._multiplier = multiplier

    @property
    def multiplier(self):
        return self._multiplier

    def affect(self, phenotype: Phenotype):
        phenotype.appetite = int((phenotype.strength + phenotype.defense + phenotype.speed/2) * self._multiplier)

    def merge(self, another_gene: 'AdjustingAppetiteGene') -> BaseGene:
        dominating_gene = super().merge(another_gene)
        if dominating_gene is not None:
            return dominating_gene
        
        multiplier = round((self.multiplier + another_gene.multiplier) / 2, self.MULTIPLIER_NDIGITS)
        return AdjustingAppetiteGene(self.domination_code, multiplier)
    
    def mutate(self, percent: int, super_mutate_chance: int, super_mutate_percent: int) -> BaseGene:
        multiplier = self._deviate_value(self._multiplier, percent, super_mutate_chance, super_mutate_percent)
        multiplier = round(multiplier, self.MULTIPLIER_NDIGITS)
        return AdjustingAppetiteGene.build(DominationCodes.random(), multiplier)
    
    def upgrade(self) -> 'AdjustingAppetiteGene':
        return AdjustingAppetiteGene.build(DominationCodes.random(), self.multiplier)
        