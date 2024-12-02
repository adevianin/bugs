from .base.genes_types import GenesTypes
from .base.base_gene import BaseGene
from core.world.entities.ant.base.genetic.phenotype import Phenotype
from .base.domination_codes import DominationCodes
import math 
from core.world.settings import SUPER_GENE_UPGRADE_MULTIPLIER
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes

class BodySightDistanceGene(BaseGene):

    @classmethod
    def build(cls, domination_code: DominationCodes, sight_distance: int):
        return BodySightDistanceGene(domination_code, sight_distance)
    
    @staticmethod
    def build_new_for_specie_gene():
        return BodySightDistanceGene.build(DominationCodes.random(), 200)

    def __init__(self, domination_code: DominationCodes, sight_distance: int):
        super().__init__(GenesTypes.BODY_SIGHT_DISTANCE, ChromosomeTypes.BODY, domination_code)
        self._sight_distance = sight_distance

    @property
    def sight_distance(self):
        return self._sight_distance
    
    def affect(self, phenotype: Phenotype):
        phenotype.sight_distance = self._sight_distance

    def merge(self, another_gene: 'BodySightDistanceGene') -> BaseGene:
        dominating_gene = super().merge(another_gene)
        if dominating_gene is not None:
            return dominating_gene
        
        sight_distance = math.ceil((self.sight_distance + another_gene.sight_distance) / 2)
        return BodySightDistanceGene.build(self.domination_code, sight_distance)
    
    def mutate(self, percent: int, super_mutate_chance: int, super_mutate_percent: int) -> BaseGene:
        return BodySightDistanceGene.build(DominationCodes.random(), self._deviate_value(self.sight_distance, percent, super_mutate_chance, super_mutate_percent))
    
    def upgrade(self) -> 'BodySightDistanceGene':
        return BodySightDistanceGene.build(DominationCodes.random(), self._sight_distance * SUPER_GENE_UPGRADE_MULTIPLIER)
        