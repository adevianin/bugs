from core.world.entities.thought.thought_factory import ThoughtFactory
from core.world.utils.point import Point
from core.world.entities.base.entity_collection import EntityCollection
from core.world.entities.thought.thought_types import ThoughtTypes

class JsonThoughtFactory():

    def __init__(self, thought_factory: ThoughtFactory):
        self._thought_factory = thought_factory

    def build_thougth_from_json(self, thought_json: dict, entities_collection: EntityCollection):
        match thought_json['type']:
            case ThoughtTypes.GO_IN_NEST:
                nest = entities_collection.get_entity_by_id(thought_json['nest_id'])
                return self._thought_factory.build_go_in_nest_thought(nest=nest, flags=thought_json['flags'], sayback=thought_json['sayback'])
            case ThoughtTypes.WALK_TO:
                position = Point(thought_json['position'][0], thought_json['position'][1])
                return self._thought_factory.build_walk_to_thought(position=position, flags=thought_json['flags'], sayback=thought_json['sayback'])
            case ThoughtTypes.SEARCHING_WALK:
                search_near_point = Point(thought_json['search_near_point'][0], thought_json['search_near_point'][1])
                return self._thought_factory.build_searching_walk_thought(search_near_point=search_near_point, search_radius=thought_json['search_radius'], flags=thought_json['flags'], sayback=thought_json['sayback'])
            case ThoughtTypes.FIND_FOOD:
                searching_walk_subthought = self.build_thougth_from_json(thought_json['searching_walk'])
                return self._thought_factory.build_find_food_thought(searching_walk_subthought=searching_walk_subthought, flags=thought_json['flags'], sayback=thought_json['sayback'])
            case ThoughtTypes.COLLECT_FOOD:
                nest = entities_collection.get_entity_by_id(thought_json['nest_id'])
                find_food_thought = self.build_thougth_from_json(thought_json['find_food_thought'])
                go_home_thought = self.build_thougth_from_json(thought_json['go_home_thought'])
                found_food = entities_collection.get_entity_by_id(thought_json['found_food_id']) if thought_json['found_food_id'] else None
                return self._thought_factory.build_collect_food_thought(nest=nest, find_food_thought=find_food_thought, go_gome_thought=go_home_thought, found_food=found_food, flags=thought_json['flags'], sayback=thought_json['sayback'])
            case ThoughtTypes.FEED_MYSELF:
                home = entities_collection.get_entity_by_id(thought_json['home_id'])
                found_food = entities_collection.get_entity_by_id(thought_json['found_food_id']) if thought_json['found_food_id'] else None
                find_food_thought = self.build_thougth_from_json(thought_json['find_food_thought'])
                go_home_thought = self.build_thougth_from_json(thought_json['go_home_thought'])
                return self._thought_factory.build_feed_myself_thought(home=home, find_food_thought=find_food_thought, go_home_thought=go_home_thought, found_food=found_food, flags=thought_json['flags'], sayback=thought_json['sayback'])
            case ThoughtTypes.PREPARE_FOR_OPERATION:
                feed_myself_thought = self.build_thougth_from_json(thought_json['feed_myself_thought'])
                assemble_point = Point(thought_json['assemble_point'][0], thought_json['assemble_point'][1])
                return self._thought_factory.build_prepare_for_operation_thought(feed_myself_thought=feed_myself_thought, assemble_point=assemble_point, flags=thought_json['flags'], sayback=thought_json['sayback'])

