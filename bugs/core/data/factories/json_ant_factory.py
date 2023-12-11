from core.world.entities.ant.ant_factory import AntFactory
from core.world.utils.point import Point
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.base.entity_collection import EntityCollection
from .json_stats_factory import JsonStatsFactory

class JsonAntFactory():

    def __init__(self, json_stats_factory: JsonStatsFactory, ant_factory: AntFactory):
        self._ant_factory = ant_factory
        self._json_stats_factory = json_stats_factory

    def build_ant_from_json(self, ant_json: dict, entities_collection: EntityCollection):
        position = Point.from_json(ant_json['position'])
        angle = ant_json['angle']
        nest = entities_collection.get_entity_by_id(ant_json['from_nest']) if ant_json['from_nest'] else None
        located_in_nest = None
        if ant_json['located_in_nest_id'] != None:
            located_in_nest = entities_collection.get_entity_by_id(ant_json['located_in_nest_id'])
        ant_type = AntTypes(ant_json['ant_type'])

        stats = self._json_stats_factory.build_stats(ant_json['stats'])

        picked_item = None
        if ant_json['picked_item_id'] != None:
            picked_item = entities_collection.get_entity_by_id(ant_json['picked_item_id'])

        id=ant_json['id']
        from_colony_id=ant_json['from_colony_id']
        is_auto_thought_generation=ant_json['is_auto_thought_generation']
        is_in_operation = ant_json['is_in_operation']
        memory_data = ant_json['memory']

        hp = ant_json['hp']
        
        return self._ant_factory.build_ant(id=id, from_colony_id=from_colony_id, stats=stats, ant_type=ant_type, position=position, angle=angle, hp=hp, home_nest=nest, located_in_nest=located_in_nest, memory_data=memory_data, is_auto_thought_generation=is_auto_thought_generation, picked_item=picked_item, is_in_operation=is_in_operation)
