from .base.genes_types import GenesTypes
from .base.base_gene import BaseGene
from core.world.entities.ant.base.genetic.phenotype import Phenotype
from .base.domination_codes import DominationCodes
import math 

class BaseHpRegenRateGene(BaseGene):

    @classmethod
    def build(cls, domination_code: DominationCodes, hp_regen_rate: int):
        return BaseHpRegenRateGene(domination_code, hp_regen_rate)

    def __init__(self, domination_code: DominationCodes, hp_regen_rate: int):
        super().__init__(GenesTypes.BASE_HP_REGEN_RATE, domination_code)
        self._hp_regen_rate = hp_regen_rate

    @property
    def hp_regen_rate(self):
        return self._hp_regen_rate
    
    def affect(self, phenotype: Phenotype):
        phenotype.hp_regen_rate = self._hp_regen_rate

    def merge(self, another_gene: 'BaseHpRegenRateGene') -> BaseGene:
        dominating_gene = super().merge(another_gene)
        if dominating_gene is not None:
            return dominating_gene
        
        hp_regen_rate = math.ceil((self.hp_regen_rate + another_gene.hp_regen_rate) / 2)
        return BaseHpRegenRateGene.build(self.domination_code, hp_regen_rate)
        