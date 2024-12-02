from .base.genes_types import GenesTypes
from .base.base_gene import BaseGene
from core.world.entities.ant.base.genetic.phenotype import Phenotype
from .base.domination_codes import DominationCodes
import math 
from core.world.settings import SUPER_GENE_UPGRADE_MULTIPLIER
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes

class BodyHpRegenRateGene(BaseGene):

    @classmethod
    def build(cls, domination_code: DominationCodes, hp_regen_rate: int):
        return BodyHpRegenRateGene(domination_code, hp_regen_rate)
    
    @staticmethod
    def build_new_for_specie_gene():
        return BodyHpRegenRateGene.build(DominationCodes.random(), 5)

    def __init__(self, domination_code: DominationCodes, hp_regen_rate: int):
        super().__init__(GenesTypes.BODY_HP_REGEN_RATE, ChromosomeTypes.BODY, domination_code)
        self._hp_regen_rate = hp_regen_rate

    @property
    def hp_regen_rate(self):
        return self._hp_regen_rate
    
    def affect(self, phenotype: Phenotype):
        phenotype.hp_regen_rate = self._hp_regen_rate

    def merge(self, another_gene: 'BodyHpRegenRateGene') -> BaseGene:
        dominating_gene = super().merge(another_gene)
        if dominating_gene is not None:
            return dominating_gene
        
        hp_regen_rate = math.ceil((self.hp_regen_rate + another_gene.hp_regen_rate) / 2)
        return BodyHpRegenRateGene.build(self.domination_code, hp_regen_rate)
    
    def mutate(self, percent: int, super_mutate_chance: int, super_mutate_percent: int) -> BaseGene:
        return BodyHpRegenRateGene.build(DominationCodes.random(), self._deviate_value(self.hp_regen_rate, percent, super_mutate_chance, super_mutate_percent))
    
    def upgrade(self) -> 'BodyHpRegenRateGene':
        return BodyHpRegenRateGene.build(DominationCodes.random(), self._hp_regen_rate * SUPER_GENE_UPGRADE_MULTIPLIER)
        