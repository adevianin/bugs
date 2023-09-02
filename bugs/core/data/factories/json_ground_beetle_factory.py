from core.world.entities.base.entity_collection import EntityCollection
from core.world.entities.ground_beetle.ground_beetle_factory import GroundBeetleFactory
from core.world.utils.point import Point

class JsonGroundBeetleFactory():

    def __init__(self, ground_beetle_factory: GroundBeetleFactory):
        self._ground_beetle_factory = ground_beetle_factory

    def build_ground_beetle_from_json(self, ground_beetle_json: dict, entities_collection: EntityCollection):
        id = ground_beetle_json['id']
        from_colony_id = ground_beetle_json['from_colony_id']
        dna_profile = ground_beetle_json['dna_profile']
        position = Point.from_json(ground_beetle_json['position'])
        angle = ground_beetle_json['angle']
        hp = ground_beetle_json['hp']
        memory_data = ground_beetle_json['memory']
        is_auto_thought_generation=ground_beetle_json['is_auto_thought_generation']

        return self._ground_beetle_factory.build_ground_beetle(id, from_colony_id, dna_profile, position, angle, hp, memory_data, is_auto_thought_generation)
