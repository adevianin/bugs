from core.world.entities.nest.nest_factory import NestFactory
from core.world.utils.point import Point
from .larva_deserializer import LarvaDeserializer
from .egg_deserializer import EggDeserializer

class NestDeserializer():

    def __init__(self, larva_deserializer: LarvaDeserializer, egg_deserializer: EggDeserializer, nest_factory: NestFactory):
        self._larva_deserializer = larva_deserializer
        self._egg_deserializer = egg_deserializer
        self._nest_factory = nest_factory

    def deserialize_nest(self, nest_json: dict):
        id = nest_json['id']
        position = Point.from_json(nest_json['position'])
        angle = nest_json['angle']
        from_colony_id = nest_json['from_colony_id']
        owner_id = nest_json['owner_id']
        hp = nest_json['hp']
        larva_places_count = nest_json['larva_places_count']
        egg_places_count = nest_json['egg_places_count']
        stored_calories = nest_json['stored_calories']
        area = nest_json['area']
        build_progress = nest_json['build_progress']
        larvae = [self._larva_deserializer.deserialize_larva(larva_json) for larva_json in nest_json['larvae']]
        eggs = [self._egg_deserializer.deserialize_egg(egg_json) for egg_json in nest_json['eggs']]
        return self._nest_factory.build_nest(id, position, angle, from_colony_id, owner_id, hp, larvae, eggs, larva_places_count, egg_places_count, stored_calories, area, build_progress)
    