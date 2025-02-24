from core.world.entities.ant.base.genetic.phenotype import Phenotype
from .base.genes_types import GenesTypes
from .base.base_gene import BaseGene
from .base.domination_codes import DominationCodes
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes

class SpecializationBuildingSubnestGene(BaseGene):

    @classmethod
    def build(cls, domination_code: DominationCodes):
        return SpecializationBuildingSubnestGene(domination_code)
    
    @staticmethod
    def build_new_for_specie_gene():
        return SpecializationBuildingSubnestGene.build(DominationCodes.random())

    def __init__(self, domination_code: DominationCodes):
        super().__init__(GenesTypes.SPECIALIZATION_BUILDING_SUBNEST, ChromosomeTypes.SPECIALIZATION, domination_code)

    def affect(self, phenotype: Phenotype):
        pass

    def merge(self, another_gene: 'SpecializationBuildingSubnestGene') -> 'SpecializationBuildingSubnestGene':
        dominating_gene = super().merge(another_gene)
        if dominating_gene is not None:
            return dominating_gene
        
        return self

    def mutate(self, percent: int, super_mutate_chance: int, super_mutate_percent: int) -> 'SpecializationBuildingSubnestGene':
        return SpecializationBuildingSubnestGene.build(DominationCodes.random())
    
    def upgrade(self) -> 'SpecializationBuildingSubnestGene':
        return SpecializationBuildingSubnestGene.build(DominationCodes.random())
