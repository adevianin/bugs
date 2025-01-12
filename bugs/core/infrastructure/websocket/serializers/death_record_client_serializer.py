from .util_client_serializer import UtilClientSerializer
from core.world.entities.base.death_record.base_death_record import BaseDeathRecord
from core.world.entities.base.death_record.death_record_types import DeathRecordTypes
from core.world.entities.base.death_record.damage_death_record import DamageDeathRecord
from core.world.entities.base.death_record.nuptiali_fly_death_record import NuptialFlyDeathRecord
from core.world.entities.base.death_record.no_home_death_record import NoHomeDeathRecord
from core.world.entities.base.death_record.age_death_record import AgeDeathRecord
from core.world.entities.base.death_record.hunger_death_record import HungerDeathRecord
from core.world.entities.base.death_record.simple_death_record import SimpleDeathRecord
from core.world.entities.base.death_record.buried_in_destructed_nest_death_record import BuriedInDestructedNestDeathRecord

class DeathRecordClientSerializer():

    def __init__(self, util_client_serializer: UtilClientSerializer):
        self._util_client_serializer = util_client_serializer

    def serialize(self, death_record: BaseDeathRecord):
        match(death_record.type):
            case DeathRecordTypes.DAMAGE:
                return self._serialize_damage_death_record(death_record)
            case DeathRecordTypes.NUPTIAL_FLY:
                return self._serialize_nuptial_fly_death_record(death_record)
            case DeathRecordTypes.NO_HOME:
                return self._serialize_no_home_death_record(death_record)
            case DeathRecordTypes.AGED:
                return self._serialize_age_death_record(death_record)
            case DeathRecordTypes.HUNGER:
                return self._serialize_hunger_death_record(death_record)
            case DeathRecordTypes.SIMPLE:
                return self._serialize_simple_death_record(death_record)
            case DeathRecordTypes.BURIED_IN_DESTRUCTED_NEST:
                return self._serialize_buried_in_destructed_nest_death_record(death_record)
            case _:
                raise('unknown type of death record')
    
    def _serialize_common_props(self, death_record: BaseDeathRecord):
        return {
            'type': death_record.type,
            'deathPosition': self._util_client_serializer.serialize_point(death_record.death_position)
        }

    def _serialize_damage_death_record(self, death_record: DamageDeathRecord):
        props = self._serialize_common_props(death_record)
        props.update({
            'damageType': death_record.damage_type
        })
        return props
    
    def _serialize_nuptial_fly_death_record(self, death_record: NuptialFlyDeathRecord):
        props = self._serialize_common_props(death_record)
        return props
    
    def _serialize_no_home_death_record(self, death_record: NoHomeDeathRecord):
        props = self._serialize_common_props(death_record)
        return props
    
    def _serialize_age_death_record(self, death_record: AgeDeathRecord):
        props = self._serialize_common_props(death_record)
        return props
    
    def _serialize_hunger_death_record(self, death_record: HungerDeathRecord):
        props = self._serialize_common_props(death_record)
        return props
    
    def _serialize_simple_death_record(self, death_record: SimpleDeathRecord):
        props = self._serialize_common_props(death_record)
        return props
    
    def _serialize_buried_in_destructed_nest_death_record(self, death_record: BuriedInDestructedNestDeathRecord):
        props = self._serialize_common_props(death_record)
        return props