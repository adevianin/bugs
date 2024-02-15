from core.world.entities.ant.base.genetic.genes.genes_types import GenesTypes
from ..base_gene import BaseGene
from core.world.entities.ant.base.genetic.phenotype import Phenotype
import math 

class StrengthGene(BaseGene):

    @classmethod
    def build(cls, domination_lvl: int, strength: int):
        return StrengthGene(domination_lvl, strength)

    def __init__(self, domination_lvl: int, strength: int):
        super().__init__(GenesTypes.STRENGTH, domination_lvl)
        self._strength = strength

    @property
    def strength(self):
        return self._strength
    
    def affect(self, phenotype: Phenotype):
        phenotype.strength = self._strength

    def merge(self, another_gene: 'StrengthGene') -> BaseGene:
        dominating_gene = super().merge(another_gene)
        if dominating_gene is not None:
            return dominating_gene
        
        strength = math.ceil((self.strength + another_gene.strength) / 2)
        return StrengthGene.build(self.domination_lvl, strength)
        