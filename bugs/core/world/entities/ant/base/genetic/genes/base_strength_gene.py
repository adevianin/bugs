from .base.genes_types import GenesTypes
from .base.base_gene import BaseGene
from core.world.entities.ant.base.genetic.phenotype import Phenotype
from .base.domination_codes import DominationCodes
import math 

class BaseStrengthGene(BaseGene):

    @classmethod
    def build(cls, domination_code: DominationCodes, strength: int):
        return BaseStrengthGene(domination_code, strength)

    def __init__(self, domination_code: DominationCodes, strength: int):
        super().__init__(GenesTypes.BASE_STRENGTH, domination_code)
        self._strength = strength

    @property
    def strength(self):
        return self._strength
    
    def affect(self, phenotype: Phenotype):
        phenotype.strength = self._strength

    def merge(self, another_gene: 'BaseStrengthGene') -> BaseGene:
        dominating_gene = super().merge(another_gene)
        if dominating_gene is not None:
            return dominating_gene
        
        strength = math.ceil((self.strength + another_gene.strength) / 2)
        return BaseStrengthGene.build(self.domination_code, strength)
        