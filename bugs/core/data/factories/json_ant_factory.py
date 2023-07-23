from core.world.entities.ant.ant_factory import AntFactory
from core.world.utils.point import Point
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.base.entity_collection import EntityCollection
from core.data.factories.json_memory_factory import JsonMemoryFactory

class JsonAntFactory():

    def __init__(self, ant_factory: AntFactory, json_memory_factory: JsonMemoryFactory):
        self._ant_factory = ant_factory
        self._json_memory_factory = json_memory_factory

    def build_ant_from_json(self, ant_json: dict, entities_collection: EntityCollection):
        position = Point(ant_json['position'][0], ant_json['position'][1])
        nest = entities_collection.get_entity_by_id(ant_json['from_nest'])
        located_in_nest = None
        if ant_json['located_in_nest_id'] != None:
            located_in_nest = entities_collection.get_entity_by_id(ant_json['located_in_nest_id'])
        ant_type = AntTypes(ant_json['ant_type'])
        memory = self._json_memory_factory.build_memory_from_json(ant_json['memory'])

        picked_food = None
        if ant_json['picked_food_id'] != None:
            picked_food = entities_collection.get_entity_by_id(ant_json['picked_food_id'])

        id=ant_json['id']
        from_colony=ant_json['from_colony']
        dna_profile=ant_json['dna_profile']
        is_auto_thought_generation=ant_json['is_auto_thought_generation']
        is_in_operation = ant_json['is_in_operation']

        hp = ant_json['hp']
        
        return self._ant_factory.build_ant(id=id, from_colony=from_colony, ant_type=ant_type, dna_profile=dna_profile, position=position, hp=hp, nest=nest, located_in_nest=located_in_nest, memory=memory, is_auto_thought_generation=is_auto_thought_generation, picked_food=picked_food, is_in_operation=is_in_operation)
