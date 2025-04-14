from .base.genes_types import GenesTypes
from .base.base_gene import BaseGene
from core.world.entities.ant.base.genetic.phenotype import Phenotype
from .base.domination_codes import DominationCodes
from core.world.settings import NUPT_MALE_SUPER_GENE_UPGRADE_MULTIPLIER, BASE_BODY_DEFENSE
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes

class BodyDefenseGene(BaseGene):

    @classmethod
    def build(cls, domination_code: DominationCodes, defense: float):
        return BodyDefenseGene(domination_code, defense)
    
    @staticmethod
    def build_new_for_specie_gene():
        return BodyDefenseGene.build(DominationCodes.random(), BASE_BODY_DEFENSE)

    def __init__(self, domination_code: DominationCodes, defense: float):
        super().__init__(GenesTypes.BODY_DEFENSE, ChromosomeTypes.BODY, domination_code)
        self._defense = defense

    @property
    def defense(self):
        return self._defense
    
    def affect(self, phenotype: Phenotype):
        phenotype.defense = self._defense

    def merge(self, another_gene: 'BodyDefenseGene') -> BaseGene:
        dominating_gene = super().merge(another_gene)
        if dominating_gene is not None:
            return dominating_gene
        
        defense = (self.defense + another_gene.defense) / 2
        return BodyDefenseGene.build(self.domination_code, defense)
    
    def mutate(self, percent: int, super_mutate_chance: int, super_mutate_percent: int) -> BaseGene:
        return BodyDefenseGene.build(DominationCodes.random(), self._deviate_value(self.defense, percent, super_mutate_chance, super_mutate_percent))
    
    def upgrade(self) -> 'BodyDefenseGene':
        return BodyDefenseGene.build(DominationCodes.random(), self._defense * NUPT_MALE_SUPER_GENE_UPGRADE_MULTIPLIER)
        