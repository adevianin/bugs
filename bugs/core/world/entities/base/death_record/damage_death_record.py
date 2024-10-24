from core.world.utils.point import Point
from .base_death_record import BaseDeathRecord
from core.world.entities.base.damage_types import DamageTypes
from .death_record_types import DeathRecordTypes

class DamageDeathRecord(BaseDeathRecord):

    def __init__(self, death_position: Point, damage_type: DamageTypes):
        super().__init__(DeathRecordTypes.DAMAGE, death_position)
        self.damage_type = damage_type