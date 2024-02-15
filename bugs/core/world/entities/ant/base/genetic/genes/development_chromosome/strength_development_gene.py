from core.world.entities.ant.base.genetic.genes.genes_types import GenesTypes
from ..base_gene import BaseGene
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.ant.base.genetic.phenotype import Phenotype

class StrengthDevelopmentGene(BaseGene):

    @classmethod
    def build(cls, domination_lvl: int, multiplier: int, ant_type: AntTypes):
        return StrengthDevelopmentGene(domination_lvl, multiplier, ant_type)

    def __init__(self, domination_lvl: int, multiplier: int, ant_type: AntTypes):
        super().__init__(GenesTypes.STRENGTH_DEVELOPMENT, domination_lvl)
        self._multiplier = multiplier
        self._ant_type = ant_type

    @property
    def multiplier(self):
        return self._multiplier
    
    @property
    def ant_type(self) -> AntTypes:
        return self._ant_type
    
    def affect(self, stats: Phenotype):
        stats.strength *= self._multiplier