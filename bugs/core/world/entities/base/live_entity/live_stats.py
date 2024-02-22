from core.world.entities.base.basic_stats import BasicStats
from core.world.entities.base.stats_types import StatsTypes

class LiveStats(BasicStats):

    @classmethod
    def build(cls, max_hp: int, hp_regen_rate: int, distance_per_step: int, sight_distance: int, attack: int, defence: int):
        return LiveStats(max_hp, hp_regen_rate, distance_per_step, sight_distance, attack, defence)

    def __init__(self, max_hp: int, hp_regen_rate: int, distance_per_step: int, sight_distance: int, attack: int, defence: int):
        super().__init__(StatsTypes.LIVE_STATS, max_hp, hp_regen_rate)
        self.distance_per_step = distance_per_step
        self.sight_distance = sight_distance
        self.attack = attack
        self.defence = defence

    def clone(self) -> 'LiveStats':
        return LiveStats(self.max_hp, self.hp_regen_rate, self.distance_per_step, self.sight_distance, self.attack, self.defence)
    