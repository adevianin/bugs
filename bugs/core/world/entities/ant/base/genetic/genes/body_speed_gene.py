from .base.genes_types import GenesTypes
from .base.base_gene import BaseGene
from core.world.entities.ant.base.genetic.phenotype import Phenotype
from .base.domination_codes import DominationCodes
from core.world.settings import NUPT_MALE_SUPER_GENE_UPGRADE_MULTIPLIER, BASE_BODY_SPEED, MAX_BODY_SPEED, MIN_BODY_SPEED
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes

class BodySpeedGene(BaseGene):

    @classmethod
    def build(cls, domination_code: DominationCodes, speed: int):
        return BodySpeedGene(domination_code, speed)
    
    @staticmethod
    def build_new_for_specie_gene():
        return BodySpeedGene.build(DominationCodes.random(), BASE_BODY_SPEED)

    def __init__(self, domination_code: DominationCodes, speed: int):
        super().__init__(GenesTypes.BODY_SPEED, ChromosomeTypes.BODY, domination_code)
        if speed > MAX_BODY_SPEED:
            speed = MAX_BODY_SPEED

        if speed < MIN_BODY_SPEED:
            speed = MIN_BODY_SPEED
            
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
        
        speed = (self.speed + another_gene.speed) / 2
        return BodySpeedGene.build(self.domination_code, speed)
    
    def mutate(self, percent: int, super_mutate_chance: int, super_mutate_percent: int) -> BaseGene:
        return BodySpeedGene.build(DominationCodes.random(), self._deviate_value(self.speed, percent, super_mutate_chance, super_mutate_percent))
    
    def upgrade(self) -> 'BodySpeedGene':
        return BodySpeedGene.build(DominationCodes.random(), self._speed * NUPT_MALE_SUPER_GENE_UPGRADE_MULTIPLIER)
        