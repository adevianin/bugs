from core.world.entities.base.basic_stats import BasicStats
from core.world.entities.base.stats_types import StatsTypes

class NestStats(BasicStats):

    @classmethod
    def build(cls, max_hp: int, hp_regen_rate: int, max_fortification: int):
        return NestStats(StatsTypes.NEST, max_hp, hp_regen_rate, max_fortification)

    def __init__(self, type: StatsTypes, max_hp: int, hp_regen_rate: int, max_fortification: int):
        super().__init__(type, max_hp, hp_regen_rate)
        self.max_fortification = max_fortification
