from .base.genes_types import GenesTypes
from .base.base_gene import BaseGene
from core.world.entities.ant.base.genetic.phenotype import Phenotype
from .base.domination_codes import DominationCodes
import math 

class BaseSightDistanceGene(BaseGene):

    @classmethod
    def build(cls, domination_code: DominationCodes, sight_distance: int):
        return BaseSightDistanceGene(domination_code, sight_distance)

    def __init__(self, domination_code: DominationCodes, sight_distance: int):
        super().__init__(GenesTypes.BASE_SIGHT_DISTANCE, domination_code)
        self._sight_distance = sight_distance

    @property
    def sight_distance(self):
        return self._sight_distance
    
    def affect(self, phenotype: Phenotype):
        phenotype.sight_distance = self._sight_distance

    def merge(self, another_gene: 'BaseSightDistanceGene') -> BaseGene:
        dominating_gene = super().merge(another_gene)
        if dominating_gene is not None:
            return dominating_gene
        
        sight_distance = math.ceil((self.sight_distance + another_gene.sight_distance) / 2)
        return BaseSightDistanceGene.build(self.domination_code, sight_distance)
        