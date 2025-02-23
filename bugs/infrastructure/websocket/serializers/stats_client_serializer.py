from core.world.entities.base.basic_stats import BasicStats
from core.world.entities.base.stats_types import StatsTypes
from core.world.entities.base.live_entity.live_stats import LiveStats
from core.world.entities.ant.base.ant_stats import AntStats

class StatsClientSerializer():

    def serialize(self, stats: BasicStats):
        match(stats.type):
            case StatsTypes.BASIC:
                return self._serialize_basic_stats(stats)
            case StatsTypes.LIVE:
                return self._serialize_live_stats(stats)
            case StatsTypes.ANT:
                return self._serialize_ant_stats(stats)
            case _:
                raise Exception('unknown type of stats')
            
    def _serialize_basic_stats(self, stats: BasicStats):
        return {
            "maxHp": stats.max_hp,
            "hpRegenRate": stats.hp_regen_rate
        }
    
    def _serialize_live_stats(self, stats: LiveStats):
        json = self._serialize_basic_stats(stats)
        json.update({
            "distancePerStep": stats.distance_per_step,
            "sightDistance": stats.sight_distance,
            "strength": stats.strength,
            "defence": stats.defence,
            "appetite": stats.appetite,
            "minTemperature": stats.min_temperature,
            "lifeSpan": stats.life_span
        })
        return json
    
    def _serialize_ant_stats(self, stats: AntStats):
        json = self._serialize_live_stats(stats)
        return json