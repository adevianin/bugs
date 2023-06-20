from core.world.utils.point import Point
from .nest import Nest
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.ant.base.larva import Larva
from core.world.utils.event_emiter import EventEmitter
from core.world.id_generator import IdGenerator

class NestFactory():

    def __init__(self, event_bus: EventEmitter, id_generator: IdGenerator):
        self._event_bus = event_bus
        self._id_generator = id_generator

    def build_nest_from_json(self, nest_json: dict):
        position = Point(nest_json['position'][0], nest_json['position'][1])
        larvae = self._build_larvae_from_json(nest_json['larvae'], position)
        return Nest(self._event_bus, nest_json['id'], position, nest_json['from_colony'], larvae, nest_json['larva_places_count'], nest_json['stored_calories'], nest_json['area'])

    def build_new_nest(self, position: Point, from_colony: int):
        return Nest(event_bus=self._event_bus, id=self._id_generator.generate_id(), position=position, from_colony=from_colony, larvae=[], larva_places_count=3, stored_calories=0, area=300)
    
    def _build_larvae_from_json(self, larvae_json: list, position: Point):
        larvae = []
        for larva_json in larvae_json:
            larva = Larva.build_larva(position, AntTypes(larva_json['type']), larva_json['dna_profile'], larva_json['ate_calories'])
            larvae.append(larva)

        return larvae
