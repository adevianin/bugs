from core.world.utils.point import Point
from .nest import Nest
from core.world.entities.ant.base.larva import Larva
from core.world.utils.event_emiter import EventEmitter
from .nest_body import NestBody
from core.world.entities.base.stats_library import StatsLibrary
from core.world.entities.ant.base.egg import Egg
from core.world.entities.base.ownership_config import OwnershipConfig
from typing import List

class NestFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_new_nest(self, id: int, position: Point, ownership: OwnershipConfig):
        return self.build_nest(id=id, position=position, angle=0, hp=100, ownership=ownership, is_removal_blocked=False, larvae=[], eggs=[], stored_calories=0, area=300, 
                               build_progress=0, fortification=0)
    
    def build_nest(self, id: int, position: Point, angle: int, ownership: OwnershipConfig, is_removal_blocked: bool, hp: int, larvae: List[Larva], eggs: List[Egg], stored_calories: int, area: int, 
                   build_progress: int, fortification: int):
        stats = StatsLibrary.NEST_DEFAULT
        body = NestBody(EventEmitter(), stats, position, angle, hp, larvae, eggs, stored_calories, area, build_progress, fortification)
        return Nest(self._event_bus, EventEmitter(), id, ownership, is_removal_blocked, body)
    