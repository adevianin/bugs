from core.world.utils.point import Point
from .nest import Nest
from core.world.entities.ant.base.larva import Larva
from core.world.utils.event_emiter import EventEmitter

class NestFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_new_nest(self, position: Point, from_colony: int):
        return Nest(event_bus=self._event_bus, id=None, position=position, from_colony=from_colony, larvae=[], larva_places_count=3, stored_calories=0, area=300)
    
    def build_nest(self, id: int, position: Point, from_colony: int, larvae: list[Larva], larva_places_count: int, stored_calories: int, area: int):
        return Nest(event_bus=self._event_bus, id=id, position=position, from_colony=from_colony, larvae=larvae, larva_places_count=larva_places_count, stored_calories=stored_calories, area=area)
    