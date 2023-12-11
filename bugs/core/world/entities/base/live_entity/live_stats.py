from core.world.entities.base.stats import Stats
from core.world.entities.base.stats_types import StatsTypes

class LiveStats(Stats):

    @classmethod
    def build(cls, max_hp: int, hp_regen_rate: int, distance_per_step: int, sight_distance: int, max_calories: int, distance_per_calorie: int, attack: int, defence: int):
        return LiveStats(max_hp, hp_regen_rate, distance_per_step, sight_distance, max_calories, distance_per_calorie, attack, defence)

    def __init__(self, max_hp: int, hp_regen_rate: int, distance_per_step: int, sight_distance: int, max_calories: int, distance_per_calorie: int, attack: int, defence: int):
        super().__init__(StatsTypes.LIVE_STATS, max_hp, hp_regen_rate)
        self.distance_per_step = distance_per_step
        self.sight_distance = sight_distance
        self.max_calories = max_calories
        self.distance_per_calorie = distance_per_calorie
        self.attack = attack
        self.defence = defence

    def clone(self) -> 'LiveStats':
        return LiveStats(self.max_hp, self.hp_regen_rate, self.distance_per_step, self.sight_distance, self.max_calories, self.distance_per_calorie, self.attack, self.defence)