from .base.genes_types import GenesTypes
from .base.base_gene import BaseGene
from core.world.entities.ant.base.genetic.phenotype import Phenotype
from .base.domination_codes import DominationCodes
import math 
from core.world.settings import SUPER_GENE_UPGRADE_MULTIPLIER
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes

class BodyStrengthGene(BaseGene):

    @classmethod
    def build(cls, domination_code: DominationCodes, strength: int):
        return BodyStrengthGene(domination_code, strength)
    
    @staticmethod
    def build_new_for_specie_gene():
        return BodyStrengthGene.build(DominationCodes.random(), 10)

    def __init__(self, domination_code: DominationCodes, strength: int):
        super().__init__(GenesTypes.BODY_STRENGTH, ChromosomeTypes.BODY, domination_code)
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
    
    def mutate(self, percent: int, super_mutate_chance: int, super_mutate_percent: int) -> BaseGene:
        return BodyStrengthGene.build(DominationCodes.random(), self._deviate_value(self.strength, percent, super_mutate_chance, super_mutate_percent))
    
    def upgrade(self) -> 'BodyStrengthGene':
        return BodyStrengthGene.build(DominationCodes.random(), self._strength * SUPER_GENE_UPGRADE_MULTIPLIER)
        