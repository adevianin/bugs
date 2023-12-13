from core.world.entities.base.stats_types import StatsTypes
from core.world.entities.base.live_entity.live_stats import LiveStats
from core.world.entities.base.basic_stats import BasicStats

class JsonStatsFactory():

    def build_stats(self, stats_json: dict):
        type = StatsTypes(stats_json['type'])
        match(type):
            case StatsTypes.BASIC:
                return self._build_basic_stats(stats_json)
            case StatsTypes.LIVE_STATS:
                return self._build_live_stats(stats_json)
            case _:
                raise Exception('unknown type of stats')


    def _build_live_stats(self, stats_json: dict):
        max_hp = stats_json['max_hp']
        hp_regen_rate = stats_json['hp_regen_rate']
        distance_per_step = stats_json['distance_per_step']
        sight_distance = stats_json['sight_distance']
        max_calories = stats_json['max_calories']
        distance_per_calorie = stats_json['distance_per_calorie']
        attack = stats_json['attack']
        defence = stats_json['defence']
        return LiveStats.build(max_hp, hp_regen_rate, distance_per_step, sight_distance, max_calories, distance_per_calorie, attack, defence)
    
    def _build_basic_stats(self, stats_json: dict):
        max_hp = stats_json['max_hp']
        hp_regen_rate = stats_json['hp_regen_rate']
        return BasicStats.build(max_hp, hp_regen_rate)