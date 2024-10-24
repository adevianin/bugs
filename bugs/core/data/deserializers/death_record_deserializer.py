from core.world.utils.point import Point
from core.world.entities.base.death_record.death_record_types import DeathRecordTypes
from core.world.entities.base.death_record.base_death_record import BaseDeathRecord
from core.world.entities.base.death_record.death_record_types import DeathRecordTypes
from core.world.entities.base.death_record.damage_death_record import DamageDeathRecord
from core.world.entities.base.death_record.nuptiali_fly_death_record import NuptialFlyDeathRecord
from core.world.entities.base.death_record.no_home_death_record import NoHomeDeathRecord
from core.world.entities.base.death_record.age_death_record import AgeDeathRecord
from core.world.entities.base.death_record.hunger_death_record import HungerDeathRecord
from core.world.entities.base.death_record.simple_death_record import SimpleDeathRecord
from core.world.entities.base.damage_types import DamageTypes

class DeathRecordDeserializer():

    def deserialize(self, json: dict) -> BaseDeathRecord:
        type = DeathRecordTypes(json['type'])
        match(type):
            case DeathRecordTypes.DAMAGE:
                return self._deserialize_damage_death_record(json)
            case DeathRecordTypes.NUPTIAL_FLY:
                return self._deserialize_nuptial_fly_death_record(json)
            case DeathRecordTypes.NO_HOME:
                return self._deserialize_no_home_death_record(json)
            case DeathRecordTypes.AGED:
                return self._deserialize_age_death_record(json)
            case DeathRecordTypes.HUNGER:
                return self._deserialize_hunger_death_record(json)
            case DeathRecordTypes.SIMPLE:
                return self._deserialize_simple_death_record(json)
            case _:
                raise('unknown type of death record')
    
    def _deserialize_common_props(self, json: dict):
        return {
            'death_position': Point.from_json(json['death_position'])
        }

    def _deserialize_damage_death_record(self, json: dict):
        props = self._deserialize_common_props(json)
        props.update({
            'damage_type': DamageTypes(json['damage_type'])
        })
        return DamageDeathRecord(**props)
    
    def _deserialize_nuptial_fly_death_record(self, json: dict):
        props = self._deserialize_common_props(json)
        return NuptialFlyDeathRecord(**props)
    
    def _deserialize_no_home_death_record(self, json: dict):
        props = self._deserialize_common_props(json)
        return NoHomeDeathRecord(**props)
    
    def _deserialize_age_death_record(self, json: dict):
        props = self._deserialize_common_props(json)
        return AgeDeathRecord(**props)
    
    def _deserialize_hunger_death_record(self, json: dict):
        props = self._deserialize_common_props(json)
        return HungerDeathRecord(**props)
    
    def _deserialize_simple_death_record(self, json: dict):
        props = self._deserialize_common_props(json)
        return SimpleDeathRecord(**props)