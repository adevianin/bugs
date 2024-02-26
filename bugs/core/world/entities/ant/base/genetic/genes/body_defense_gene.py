from .base.genes_types import GenesTypes
from .base.base_gene import BaseGene
from core.world.entities.ant.base.genetic.phenotype import Phenotype
from .base.domination_codes import DominationCodes
import math 

class BodyDefenseGene(BaseGene):

    @classmethod
    def build(cls, domination_code: DominationCodes, defense: int):
        return BodyDefenseGene(domination_code, defense)

    def __init__(self, domination_code: DominationCodes, defense: int):
        super().__init__(GenesTypes.BODY_DEFENSE, domination_code)
        self._defense = defense

    @property
    def defense(self):
        return self._defense
    
    def affect(self, phenotype: Phenotype):
        phenotype.defense = self._defense

    def merge(self, another_gene: 'BodyDefenseGene') -> BaseGene:
        dominating_gene = super().merge(another_gene)
        if dominating_gene is not None:
            return dominating_gene
        
        defense = math.ceil((self.defense + another_gene.defense) / 2)
        return BodyDefenseGene.build(self.domination_code, defense)
        