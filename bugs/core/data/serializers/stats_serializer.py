from core.world.entities.base.live_entity.live_stats import LiveStats
from core.world.entities.base.stats import Stats
from core.world.entities.base.stats_types import StatsTypes

class StatsSerializer():

    def serialize(self, stats: Stats):
        match(stats.type):
            case StatsTypes.LIVE_STATS:
                return self._serialize_live_stats(stats)
            case _:
                raise Exception('unknown type of stats')
            
    def _serialize_stats(self, stats: Stats):
        json = {
            'type': stats.type
        }
        return json

    def _serialize_live_stats(self, stats: LiveStats):
        json = self._serialize_stats(stats)

        json.update({
            'max_hp': stats.max_hp,
            'hp_regen_rate': stats.hp_regen_rate,
            'distance_per_step': stats.distance_per_step,
            'sight_distance': stats.sight_distance,
            'max_calories': stats.max_calories,
            'distance_per_calorie': stats.distance_per_calorie,
            'attack': stats.attack,
            'defence': stats.defence
        })

        return json