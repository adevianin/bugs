from .base.genes_types import GenesTypes
from .base.base_gene import BaseGene
from core.world.entities.ant.base.genetic.phenotype import Phenotype
from .base.domination_codes import DominationCodes
import math 
from core.world.settings import SUPER_GENE_UPGRADE_MULTIPLIER
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes

class BodySpeedGene(BaseGene):

    @classmethod
    def build(cls, domination_code: DominationCodes, speed: int):
        return BodySpeedGene(domination_code, speed)
    
    @staticmethod
    def build_new_for_specie_gene():
        return BodySpeedGene.build(DominationCodes.random(), 32)

    def __init__(self, domination_code: DominationCodes, speed: int):
        super().__init__(GenesTypes.BODY_SPEED, ChromosomeTypes.BODY, domination_code)
        self._speed = speed

    @property
    def speed(self):
        return self._speed
    
    def affect(self, phenotype: Phenotype):
        phenotype.speed = self._speed

    def merge(self, another_gene: 'BodySpeedGene') -> BaseGene:
        dominating_gene = super().merge(another_gene)
        if dominating_gene is not None:
            return dominating_gene
        
        speed = math.ceil((self.speed + another_gene.speed) / 2)
        return BodySpeedGene.build(self.domination_code, speed)
    
    def mutate(self, percent: int, super_mutate_chance: int, super_mutate_percent: int) -> BaseGene:
        return BodySpeedGene.build(DominationCodes.random(), self._deviate_value(self.speed, percent, super_mutate_chance, super_mutate_percent))
    
    def upgrade(self) -> 'BodySpeedGene':
        return BodySpeedGene.build(DominationCodes.random(), self._speed * SUPER_GENE_UPGRADE_MULTIPLIER)
        