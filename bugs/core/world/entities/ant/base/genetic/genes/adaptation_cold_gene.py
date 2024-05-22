from .base.genes_types import GenesTypes
from .base.base_gene import BaseGene
from core.world.entities.ant.base.genetic.phenotype import Phenotype
from .base.domination_codes import DominationCodes

class AdaptationColdGene(BaseGene):

    RAW_MIN_TEMPERATURE = 8
    POINTS_PER_TEMP_UNIT = 10

    @classmethod
    def build(cls, domination_code: DominationCodes, resistance_points: int):
        return AdaptationColdGene(domination_code, resistance_points)

    def __init__(self, domination_code: DominationCodes, resistance_points: int):
        super().__init__(GenesTypes.ADAPTATION_COLD, domination_code, True)
        self._resistance_points = resistance_points

    @property
    def resistance_points(self):
        return self._resistance_points

    def affect(self, phenotype: Phenotype):
        resistance_temperature = self._resistance_points / self.POINTS_PER_TEMP_UNIT
        phenotype.min_temperature = round(self.RAW_MIN_TEMPERATURE - resistance_temperature, 0)

    def merge(self, another_gene: 'AdaptationColdGene') -> BaseGene:
        dominating_gene = super().merge(another_gene)
        if dominating_gene is not None:
            return dominating_gene
        
        min_temp = round((self.resistance_points + another_gene.resistance_points) / 2, 0)
        return AdaptationColdGene.build(self.domination_code, min_temp)
    
    def mutate(self, percent: int, super_mutate_chance: int, super_mutate_percent: int) -> BaseGene:
        return AdaptationColdGene.build(DominationCodes.random(), self._deviate_value(self.resistance_points, percent, super_mutate_chance, super_mutate_percent))
        