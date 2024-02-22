from .base.genes_types import GenesTypes
from .base.base_gene import BaseGene
from core.world.entities.ant.base.genetic.phenotype import Phenotype
from .base.domination_codes import DominationCodes
import math 

class BaseSpeedGene(BaseGene):

    @classmethod
    def build(cls, domination_code: DominationCodes, speed: int):
        return BaseSpeedGene(domination_code, speed)

    def __init__(self, domination_code: DominationCodes, speed: int):
        super().__init__(GenesTypes.BASE_SPEED, domination_code)
        self._speed = speed

    @property
    def speed(self):
        return self._speed
    
    def affect(self, phenotype: Phenotype):
        phenotype.speed = self._speed

    def merge(self, another_gene: 'BaseSpeedGene') -> BaseGene:
        dominating_gene = super().merge(another_gene)
        if dominating_gene is not None:
            return dominating_gene
        
        speed = math.ceil((self.speed + another_gene.speed) / 2)
        return BaseSpeedGene.build(self.domination_code, speed)
        