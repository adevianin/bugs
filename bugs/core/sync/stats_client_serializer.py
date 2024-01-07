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
            "distancePerStep": stats.distance_per_step,
            "sightDistance": stats.sight_distance,
            "maxCalories": stats.max_calories,
            "distancePerCalorie": stats.distance_per_calorie,
            "attack": stats.attack,
            "defence": stats.defence
        })
        return json