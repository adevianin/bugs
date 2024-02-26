from .base.genes_types import GenesTypes
from .base.base_gene import BaseGene
from core.world.entities.ant.base.genetic.phenotype import Phenotype
from .base.domination_codes import DominationCodes
import math 

class BodyStrengthGene(BaseGene):

    @classmethod
    def build(cls, domination_code: DominationCodes, strength: int):
        return BodyStrengthGene(domination_code, strength)

    def __init__(self, domination_code: DominationCodes, strength: int):
        super().__init__(GenesTypes.BODY_STRENGTH, domination_code)
        self._strength = strength

    @property
    def strength(self):
        return self._strength
    
    def affect(self, phenotype: Phenotype):
        phenotype.strength = self._strength

    def merge(self, another_gene: 'BodyStrengthGene') -> BaseGene:
        dominating_gene = super().merge(another_gene)
        if dominating_gene is not None:
            return dominating_gene
        
        strength = math.ceil((self.strength + another_gene.strength) / 2)
        return BodyStrengthGene.build(self.domination_code, strength)
        