from .base.genes_types import GenesTypes
from .base.base_gene import BaseGene
from core.world.entities.ant.base.genetic.phenotype import Phenotype
from .base.domination_codes import DominationCodes
from core.world.settings import NUPT_MALE_SUPER_GENE_UPGRADE_MULTIPLIER
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes

class BodyLifeSpanGene(BaseGene):

    @classmethod
    def build(cls, domination_code: DominationCodes, life_span: int):
        return BodyLifeSpanGene(domination_code, life_span)
    
    @staticmethod
    def build_new_for_specie_gene():
        return BodyLifeSpanGene.build(DominationCodes.random(), 10000)

    def __init__(self, domination_code: DominationCodes, life_span: int):
        super().__init__(GenesTypes.BODY_LIFE_SPAN, ChromosomeTypes.BODY, domination_code)
        self.life_span = life_span

    def affect(self, phenotype: Phenotype):
        phenotype.life_span = self.life_span

    def merge(self, another_gene: 'BodyLifeSpanGene') -> BaseGene:
        dominating_gene = super().merge(another_gene)
        if dominating_gene is not None:
            return dominating_gene
        
        life_span = round((self.life_span + another_gene.life_span) / 2)
        return BodyLifeSpanGene.build(self.domination_code, life_span)
    
    def mutate(self, percent: int, super_mutate_chance: int, super_mutate_percent: int) -> BaseGene:
        life_span = self._deviate_value(self.life_span, percent, super_mutate_chance, super_mutate_percent)
        life_span = round(life_span)
        return BodyLifeSpanGene.build(DominationCodes.random(), life_span)
    
    def upgrade(self) -> 'BodyLifeSpanGene':
        return BodyLifeSpanGene.build(DominationCodes.random(), self.life_span * NUPT_MALE_SUPER_GENE_UPGRADE_MULTIPLIER)
        