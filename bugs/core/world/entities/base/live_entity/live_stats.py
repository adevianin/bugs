from core.world.entities.base.basic_stats import BasicStats
from core.world.entities.base.stats_types import StatsTypes

class LiveStats(BasicStats):

    @classmethod
    def build(cls, max_hp: int, hp_regen_rate: int, distance_per_step: int, sight_distance: int, strength: int, defence: int, appetite: int, min_temperature: int, life_span: int):
        return LiveStats(StatsTypes.LIVE, max_hp, hp_regen_rate, distance_per_step, sight_distance, strength, defence, appetite, min_temperature, life_span)

    def __init__(self, type: StatsTypes, max_hp: int, hp_regen_rate: int, distance_per_step: int, sight_distance: int, strength: int, defence: int, appetite: int, 
                 min_temperature: int, life_span: int):
        super().__init__(type, max_hp, hp_regen_rate)
        self.distance_per_step = distance_per_step
        self.sight_distance = sight_distance
        self.strength = strength
        self.defence = defence
        self.appetite = appetite
        self.min_temperature = min_temperature
        self.life_span = life_span
