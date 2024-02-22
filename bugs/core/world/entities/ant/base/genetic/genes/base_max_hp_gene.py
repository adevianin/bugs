from .base.genes_types import GenesTypes
from .base.base_gene import BaseGene
from core.world.entities.ant.base.genetic.phenotype import Phenotype
from .base.domination_codes import DominationCodes
import math 

class BaseMaxHpGene(BaseGene):

    @classmethod
    def build(cls, domination_code: DominationCodes, max_hp: int):
        return BaseMaxHpGene(domination_code, max_hp)

    def __init__(self, domination_code: DominationCodes, max_hp: int):
        super().__init__(GenesTypes.BASE_MAX_HP, domination_code)
        self._max_hp = max_hp

    @property
    def max_hp(self):
        return self._max_hp
    
    def affect(self, phenotype: Phenotype):
        phenotype.max_hp = self._max_hp

    def merge(self, another_gene: 'BaseMaxHpGene') -> BaseGene:
        dominating_gene = super().merge(another_gene)
        if dominating_gene is not None:
            return dominating_gene
        
        max_hp = math.ceil((self.max_hp + another_gene.max_hp) / 2)
        return BaseMaxHpGene.build(self.domination_code, max_hp)
        