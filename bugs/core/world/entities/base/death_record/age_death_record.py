from core.world.entities.base.death_record.death_record_types import DeathRecordTypes
from core.world.utils.point import Point
from .base_death_record import BaseDeathRecord

class AgeDeathRecord(BaseDeathRecord):

    def __init__(self, death_position: Point):
        super().__init__(DeathRecordTypes.AGED, death_position)