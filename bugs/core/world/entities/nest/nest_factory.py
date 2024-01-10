from core.world.utils.point import Point
from .nest import Nest
from core.world.entities.ant.base.larva import Larva
from core.world.utils.event_emiter import EventEmitter
from .nest_body import NestBody
from core.world.entities.base.stats_library import StatsLibrary

class NestFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_new_nest(self, id: int, position: Point, from_colony_id: int, owner_id: int):
        return self.build_nest(id=id, position=position, angle=0, hp=100, from_colony_id=from_colony_id, owner_id=owner_id, larvae=[], larva_places_count=3, stored_calories=0, area=300, build_progress=0)
    
    def build_nest(self, id: int, position: Point, angle: int, from_colony_id: int, owner_id: int, hp: int, larvae: list[Larva], larva_places_count: int, stored_calories: int, area: int, 
                   build_progress: int):
        stats = StatsLibrary.NEST_DEFAULT
        body = NestBody(EventEmitter(), stats, position, angle, hp, larvae, larva_places_count, stored_calories, area, build_progress)
        return Nest(self._event_bus, EventEmitter(), id, from_colony_id, owner_id, body)
    