from core.world.entities.nest.nest_factory import NestFactory
from core.world.utils.point import Point
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.ant.base.larva import Larva

class JsonNestFactory():

    def __init__(self, nest_factory: NestFactory):
        self._nest_factory = nest_factory

    def build_nest_from_json(self, nest_json: dict):
        id = nest_json['id']
        position = Point.from_json(nest_json['position'])
        angle = nest_json['angle']
        from_colony_id = nest_json['from_colony_id']
        hp = nest_json['hp']
        larva_places_count = nest_json['larva_places_count']
        stored_calories = nest_json['stored_calories']
        area = nest_json['area']
        build_progress = nest_json['build_progress']
        larvae = self._build_larvae_from_json(nest_json['larvae'])
        return self._nest_factory.build_nest(id, position, angle, from_colony_id, hp, larvae, larva_places_count, stored_calories, area, build_progress)
    
    def _build_larvae_from_json(self, larvae_json: list):
        larvae = []
        for larva_json in larvae_json:
            larva = Larva.build_larva(AntTypes(larva_json['ant_type']), larva_json['dna_profile'], larva_json['ate_calories'])
            larvae.append(larva)

        return larvae