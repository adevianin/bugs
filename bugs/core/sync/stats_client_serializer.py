from core.world.entities.base.basic_stats import BasicStats
from core.world.entities.base.stats_types import StatsTypes
from core.world.entities.base.live_entity.live_stats import LiveStats

class StatsClientSerializer():

    def serialize(self, stats: BasicStats):
        match(stats.type):
            case StatsTypes.BASIC:
                return self._serialize_basic_stats(stats)
            case StatsTypes.LIVE_STATS:
                return self._serialize_live_stats(stats)
            case _:
                raise Exception('unknown type of stats')
            
    def _serialize_basic_stats(self, stats: BasicStats):
        return {
            "max_hp": stats.max_hp,
            "hp_regen_rate": stats.hp_regen_rate
        }
    
    def _serialize_live_stats(self, stats: LiveStats):
        json = self._serialize_basic_stats(stats)
        json.update({
            "distance_per_step": stats.distance_per_step,
            "sight_distance": stats.sight_distance,
            "max_calories": stats.max_calories,
            "distance_per_calorie": stats.distance_per_calorie,
            "attack": stats.attack,
            "defence": stats.defence
        })
        return json