from .base.genes_types import GenesTypes
from .base.base_gene import BaseGene
from core.world.entities.ant.base.genetic.phenotype import Phenotype
from .base.domination_codes import DominationCodes
import math 
from core.world.settings import SUPER_GENE_UPGRADE_MULTIPLIER
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes

class BodyMaxHpGene(BaseGene):

    @classmethod
    def build(cls, domination_code: DominationCodes, max_hp: int):
        return BodyMaxHpGene(domination_code, max_hp)
    
    @staticmethod
    def build_new_for_specie_gene():
        return BodyMaxHpGene.build(DominationCodes.random(), 100)

    def __init__(self, domination_code: DominationCodes, max_hp: int):
        super().__init__(GenesTypes.BODY_MAX_HP, ChromosomeTypes.BODY, domination_code, True)
        self._max_hp = max_hp

    @property
    def max_hp(self):
        return self._max_hp
    
    def affect(self, phenotype: Phenotype):
        phenotype.max_hp = self._max_hp

    def merge(self, another_gene: 'BodyMaxHpGene') -> BaseGene:
        dominating_gene = super().merge(another_gene)
        if dominating_gene is not None:
            return dominating_gene
        
        max_hp = math.ceil((self.max_hp + another_gene.max_hp) / 2)
        return BodyMaxHpGene.build(self.domination_code, max_hp)
    
    def mutate(self, percent: int, super_mutate_chance: int, super_mutate_percent: int) -> BaseGene:
        return BodyMaxHpGene.build(DominationCodes.random(), self._deviate_value(self.max_hp, percent, super_mutate_chance, super_mutate_percent))
    
    def upgrade(self) -> 'BodyMaxHpGene':
        return BodyMaxHpGene.build(DominationCodes.random(), self._max_hp * SUPER_GENE_UPGRADE_MULTIPLIER)
        