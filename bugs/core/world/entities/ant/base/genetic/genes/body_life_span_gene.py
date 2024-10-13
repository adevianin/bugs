from .base.genes_types import GenesTypes
from .base.base_gene import BaseGene
from core.world.entities.ant.base.genetic.phenotype import Phenotype
from .base.domination_codes import DominationCodes

class BodyLifeSpanGene(BaseGene):

    @classmethod
    def build(cls, domination_code: DominationCodes, life_span: int):
        return BodyLifeSpanGene(domination_code, life_span)

    def __init__(self, domination_code: DominationCodes, life_span: int):
        super().__init__(GenesTypes.BODY_LIFE_SPAN, domination_code, True)
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
        