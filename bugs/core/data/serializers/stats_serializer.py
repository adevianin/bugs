from core.world.entities.base.live_entity.live_stats import LiveStats
from core.world.entities.base.basic_stats import BasicStats
from core.world.entities.base.stats_types import StatsTypes

class StatsSerializer():

    def serialize(self, stats: BasicStats):
        match(stats.type):
            case StatsTypes.BASIC:
                return self._serialize_basic_stats(stats)
            case StatsTypes.LIVE_STATS:
                return self._serialize_live_stats(stats)
            case _:
                raise Exception('unknown type of stats')
            
    def _serialize_stats(self, stats: BasicStats):
        json = {
            'type': stats.type
        }
        return json

    def _serialize_basic_stats(self, stats: LiveStats):
        json = self._serialize_stats(stats)

        json.update({
            'max_hp': stats.max_hp,
            'hp_regen_rate': stats.hp_regen_rate
        })

        return json
    
    def _serialize_live_stats(self, stats: LiveStats):
        json = self._serialize_stats(stats)

        json.update({
            'max_hp': stats.max_hp,
            'hp_regen_rate': stats.hp_regen_rate,
            'distance_per_step': stats.distance_per_step,
            'sight_distance': stats.sight_distance,
            'attack': stats.attack,
            'defence': stats.defence
        })

        return json