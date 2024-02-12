from core.world.entities.base.live_entity.live_stats import LiveStats
from core.world.entities.ant.base.genome.genes.genes_types import GenesTypes
from ..base_gene import BaseGene

class StrengthGene(BaseGene):

    @classmethod
    def build(cls, domination_lvl: int, strength: int):
        return StrengthGene(domination_lvl, strength)

    def __init__(self, domination_lvl: int, strength: int):
        super().__init__(GenesTypes.STRENGTH, domination_lvl)
        self._strength = strength

    def affect_stats(self, stats: LiveStats):
        stats.attack = self._strength

    @property
    def strength(self):
        return self._strength