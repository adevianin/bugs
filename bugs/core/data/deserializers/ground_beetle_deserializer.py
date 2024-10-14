from core.world.entities.base.entity_collection import EntityCollection
from core.world.entities.ground_beetle.ground_beetle_factory import GroundBeetleFactory
from core.world.utils.point import Point

class GroundBeetleDeserializer():

    def __init__(self, ground_beetle_factory: GroundBeetleFactory):
        self._ground_beetle_factory = ground_beetle_factory

    def deserialize_ground_beetle(self, ground_beetle_json: dict, entities_collection: EntityCollection):
        id = ground_beetle_json['id']
        from_colony_id = ground_beetle_json['from_colony_id']
        position = Point.from_json(ground_beetle_json['position'])
        angle = ground_beetle_json['angle']
        hp = ground_beetle_json['hp']
        memory_data = ground_beetle_json['memory']
        birth_step = ground_beetle_json['birth_step']
        is_auto_thought_generation=ground_beetle_json['is_auto_thought_generation']

        return self._ground_beetle_factory.build_ground_beetle(id, from_colony_id, position, angle, hp, birth_step, memory_data, is_auto_thought_generation)
