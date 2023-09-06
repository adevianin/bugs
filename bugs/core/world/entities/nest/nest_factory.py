from core.world.utils.point import Point
from .nest import Nest
from core.world.entities.ant.base.larva import Larva
from core.world.utils.event_emiter import EventEmitter
from .nest_body import NestBody

class NestFactory():

    def build_new_nest(self, id: int, position: Point, from_colony_id: int):
        events = EventEmitter()
        return Nest(events=events, id=id, position=position, angle=0, hp=100, from_colony_id=from_colony_id, larvae=[], larva_places_count=3, stored_calories=0, area=300, build_progress=0)
    
    def build_nest(self, id: int, position: Point, angle: int, from_colony_id: int, hp: int, larvae: list[Larva], larva_places_count: int, stored_calories: int, area: int, build_progress: int):
        events = EventEmitter()
        body = NestBody(events, position, angle, hp)
        return Nest(events=events, id=id, from_colony_id=from_colony_id, body=body, larvae=larvae, larva_places_count=larva_places_count, stored_calories=stored_calories, area=area, build_progress=build_progress)
    