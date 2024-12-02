from .base.genes_types import GenesTypes
from .base.base_gene import BaseGene
from core.world.entities.ant.base.genetic.phenotype import Phenotype
from .base.domination_codes import DominationCodes
from core.world.settings import SUPER_GENE_UPGRADE_MULTIPLIER
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes

class AdaptationColdGene(BaseGene):

    RAW_MIN_TEMPERATURE = 8
    POINTS_PER_TEMP_UNIT = 10

    @classmethod
    def build(cls, domination_code: DominationCodes, resistance_points: int):
        return AdaptationColdGene(domination_code, resistance_points)
    
    @staticmethod
    def build_new_for_specie_gene():
        return AdaptationColdGene.build(DominationCodes.random(), 80)

    def __init__(self, domination_code: DominationCodes, resistance_points: int):
        super().__init__(GenesTypes.ADAPTATION_COLD, ChromosomeTypes.ADAPTATION, domination_code)
        self._resistance_points = resistance_points

    @property
    def resistance_points(self):
        return self._resistance_points

    def affect(self, phenotype: Phenotype):
        resistance_temperature = self._resistance_points / self.POINTS_PER_TEMP_UNIT
        phenotype.min_temperature = self.RAW_MIN_TEMPERATURE - resistance_temperature

    def merge(self, another_gene: 'AdaptationColdGene') -> BaseGene:
        dominating_gene = super().merge(another_gene)
        if dominating_gene is not None:
            return dominating_gene
        
        min_temp = round((self.resistance_points + another_gene.resistance_points) / 2, 0)
        return AdaptationColdGene.build(self.domination_code, min_temp)
    
    def mutate(self, percent: int, super_mutate_chance: int, super_mutate_percent: int) -> BaseGene:
        return AdaptationColdGene.build(DominationCodes.random(), self._deviate_value(self.resistance_points, percent, super_mutate_chance, super_mutate_percent))
    
    def upgrade(self) -> 'AdaptationColdGene':
        return AdaptationColdGene.build(DominationCodes.random(), self._resistance_points * SUPER_GENE_UPGRADE_MULTIPLIER)
        