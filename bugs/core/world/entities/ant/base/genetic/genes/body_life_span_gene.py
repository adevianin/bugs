from .base.genes_types import GenesTypes
from .base.base_gene import BaseGene
from core.world.entities.ant.base.genetic.phenotype import Phenotype
from .base.domination_codes import DominationCodes
from core.world.settings import NUPT_MALE_SUPER_GENE_UPGRADE_MULTIPLIER, BASE_BODY_LIFE_SPAN, QUEEN_LIFE_SPAN_MULTIPLIER
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes
from core.world.entities.ant.base.ant_types import AntTypes

class BodyLifeSpanGene(BaseGene):

    @classmethod
    def build(cls, domination_code: DominationCodes, life_span: int):
        return BodyLifeSpanGene(domination_code, life_span)
    
    @staticmethod
    def build_new_for_specie_gene():
        return BodyLifeSpanGene.build(DominationCodes.random(), BASE_BODY_LIFE_SPAN)

    def __init__(self, domination_code: DominationCodes, life_span: int):
        super().__init__(GenesTypes.BODY_LIFE_SPAN, ChromosomeTypes.BODY, domination_code)
        self.life_span = life_span

    def affect(self, phenotype: Phenotype):
        if phenotype.ant_type == AntTypes.QUEEN:
            phenotype.life_span = QUEEN_LIFE_SPAN_MULTIPLIER * self.life_span
        else:
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
        