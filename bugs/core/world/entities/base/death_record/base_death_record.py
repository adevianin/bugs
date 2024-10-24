from abc import ABC
from core.world.utils.point import Point
from .death_record_types import DeathRecordTypes

class BaseDeathRecord(ABC):

    def __init__(self, type: DeathRecordTypes, death_position: Point):
        self.type = type
        self.death_position = death_position