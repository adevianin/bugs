from core.world.entities.base.live_entity.live_stats import LiveStats
from core.world.entities.ant.base.genetic.genes.genes_types import GenesTypes
from ..base_gene import BaseGene
from core.world.entities.ant.base.ant_types import AntTypes

class CasteDevelopmentGene(BaseGene):

    @classmethod
    def build(cls, domination_lvl: int, multiplier: int, ant_type: AntTypes):
        return CasteDevelopmentGene(domination_lvl, multiplier, ant_type)

    def __init__(self, domination_lvl: int, required_food: int, ant_type: AntTypes):
        super().__init__(GenesTypes.CASTE_DEVELOPMENT, domination_lvl)
        self._required_food = required_food
        self._ant_type = ant_type

    @property
    def required_food(self):
        return self._required_food
    
    @property
    def ant_type(self) -> AntTypes:
        return self._ant_type
    
    def affect_stats(self, stats: LiveStats):
        pass