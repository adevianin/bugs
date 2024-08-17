from core.world.entities.ant.base.genetic.phenotype import Phenotype
from .base.genes_types import GenesTypes
from .base.base_gene import BaseGene
from .base.domination_codes import DominationCodes

class BuildingSubnestGene(BaseGene):

    @classmethod
    def build(cls, domination_code: DominationCodes):
        return BuildingSubnestGene(domination_code)

    def __init__(self, domination_code: DominationCodes):
        super().__init__(GenesTypes.BUILDING_SUBNEST, domination_code, False)


    def affect(self, phenotype: Phenotype):
        pass

    def merge(self, another_gene: 'BuildingSubnestGene') -> 'BuildingSubnestGene':
        dominating_gene = super().merge(another_gene)
        if dominating_gene is not None:
            return dominating_gene
        
        return self

    def mutate(self, percent: int, super_mutate_chance: int, super_mutate_percent: int) -> 'BuildingSubnestGene':
        return BuildingSubnestGene.build(DominationCodes.random())
