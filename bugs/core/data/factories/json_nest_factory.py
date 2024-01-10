from core.world.entities.nest.nest_factory import NestFactory
from core.world.utils.point import Point
from core.data.factories.json_larva_factory import JsonLarvaFactory

class JsonNestFactory():

    def __init__(self, json_larva_factory: JsonLarvaFactory, nest_factory: NestFactory):
        self._json_larva_factory = json_larva_factory
        self._nest_factory = nest_factory

    def build_nest_from_json(self, nest_json: dict):
        id = nest_json['id']
        position = Point.from_json(nest_json['position'])
        angle = nest_json['angle']
        from_colony_id = nest_json['from_colony_id']
        owner_id = nest_json['owner_id']
        hp = nest_json['hp']
        larva_places_count = nest_json['larva_places_count']
        stored_calories = nest_json['stored_calories']
        area = nest_json['area']
        build_progress = nest_json['build_progress']
        larvae = [self._json_larva_factory.build_larva(larva_json) for larva_json in nest_json['larvae']]
        return self._nest_factory.build_nest(id, position, angle, from_colony_id, owner_id, hp, larvae, larva_places_count, stored_calories, area, build_progress)
    