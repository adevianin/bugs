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
                return self._build_go_in_nest_thought(thought_json, entities_collection)
            case ThoughtTypes.WALK_TO:
                return self._build_walk_to_thought(thought_json, entities_collection)
            case ThoughtTypes.SEARCHING_WALK:
                return self._build_searching_walk_thought(thought_json, entities_collection)
            case ThoughtTypes.FIND_FOOD:
                return self._build_find_food_thought(thought_json, entities_collection)
            case ThoughtTypes.COLLECT_FOOD:
                return self._build_collect_food_thought(thought_json, entities_collection)
            case ThoughtTypes.FEED_MYSELF:
                return self._build_feed_myself_thought(thought_json, entities_collection)
            case ThoughtTypes.PREPARE_FOR_OPERATION:
                return self._build_prepare_for_operation_thought(thought_json, entities_collection)
            case ThoughtTypes.FOUND_NEST:
                return self._build_found_nest_thought(thought_json, entities_collection)
            case ThoughtTypes.BUILD_NEST:
                return self._build_build_nest_thought(thought_json, entities_collection)
            case ThoughtTypes.DEFEND_TERRITORY:
                return self._build_defend_territory(thought_json, entities_collection)
            case ThoughtTypes.ATTACK_NEST:
                return self._build_attack_nest_thought(thought_json, entities_collection)
            case ThoughtTypes.FIGHT_ENEMY:
                return self._build_fight_enemy_thought(thought_json, entities_collection)
            case _:
                raise Exception('unknown type of thought')
            
    def _build_go_in_nest_thought(self, thought_json, entities_collection: EntityCollection):
        nest = entities_collection.get_entity_by_id(thought_json['nest_id'])
        return self._thought_factory.build_go_in_nest_thought(nest=nest, flags=thought_json['flags'], sayback=thought_json['sayback'])
    
    def _build_walk_to_thought(self, thought_json, entities_collection: EntityCollection):
        position = Point(thought_json['position'][0], thought_json['position'][1])
        return self._thought_factory.build_walk_to_thought(position=position, flags=thought_json['flags'], sayback=thought_json['sayback'])
    
    def _build_searching_walk_thought(self, thought_json, entities_collection: EntityCollection):
        search_near_point = Point(thought_json['search_near_point'][0], thought_json['search_near_point'][1])
        return self._thought_factory.build_searching_walk_thought(search_near_point=search_near_point, search_radius=thought_json['search_radius'], flags=thought_json['flags'], sayback=thought_json['sayback'])

    def _build_find_food_thought(self, thought_json, entities_collection: EntityCollection):
        searching_walk_subthought = self.build_thougth_from_json(thought_json['searching_walk'], entities_collection)
        return self._thought_factory.build_find_food_thought(searching_walk_subthought=searching_walk_subthought, flags=thought_json['flags'], sayback=thought_json['sayback'])
    
    def _build_collect_food_thought(self, thought_json, entities_collection: EntityCollection):
        nest = entities_collection.get_entity_by_id(thought_json['nest_id'])
        find_food_thought = self.build_thougth_from_json(thought_json['find_food_thought'], entities_collection)
        go_home_thought = self.build_thougth_from_json(thought_json['go_home_thought'], entities_collection)
        found_food = entities_collection.get_entity_by_id(thought_json['found_food_id']) if thought_json['found_food_id'] else None
        return self._thought_factory.build_collect_food_thought(nest=nest, find_food_thought=find_food_thought, go_gome_thought=go_home_thought, found_food=found_food, flags=thought_json['flags'], sayback=thought_json['sayback'])

    def _build_feed_myself_thought(self, thought_json, entities_collection: EntityCollection):
        home = entities_collection.get_entity_by_id(thought_json['home_id'])
        found_food = entities_collection.get_entity_by_id(thought_json['found_food_id']) if thought_json['found_food_id'] else None
        find_food_thought = self.build_thougth_from_json(thought_json['find_food_thought'], entities_collection)
        go_home_thought = self.build_thougth_from_json(thought_json['go_home_thought'], entities_collection)
        return self._thought_factory.build_feed_myself_thought(home=home, find_food_thought=find_food_thought, go_home_thought=go_home_thought, found_food=found_food, flags=thought_json['flags'], sayback=thought_json['sayback'])
    
    def _build_prepare_for_operation_thought(self, thought_json, entities_collection: EntityCollection):
        feed_myself_thought = self.build_thougth_from_json(thought_json['feed_myself_thought'], entities_collection)
        assemble_point = Point(thought_json['assemble_point'][0], thought_json['assemble_point'][1])
        return self._thought_factory.build_prepare_for_operation_thought(feed_myself_thought=feed_myself_thought, assemble_point=assemble_point, flags=thought_json['flags'], sayback=thought_json['sayback'])
    
    def _build_found_nest_thought(self, thought_json, entities_collection: EntityCollection):
        building_site = Point(thought_json['building_site'][0], thought_json['building_site'][1])
        found_nest = None
        if 'found_nest_id' in thought_json:
            found_nest = entities_collection.get_entity_by_id(thought_json['found_nest_id'])
        return self._thought_factory.build_found_nest_thought(building_site=building_site, from_colony_id=thought_json['from_colony_id'], found_nest=found_nest, flags=thought_json['flags'], sayback=thought_json['sayback'])
    
    def _build_build_nest_thought(self, thought_json, entities_collection: EntityCollection):
        building_nest = entities_collection.get_entity_by_id(thought_json['building_nest_id'])
        return self._thought_factory.build_build_nest_thought(building_nest=building_nest, flags=thought_json['flags'], sayback=thought_json['sayback'])
    
    def _build_defend_territory(self, thought_json, entities_collection: EntityCollection):
        searching_walk_thought = self.build_thougth_from_json(thought_json['searching_walk_thought'], entities_collection)
        fight_enemy_thought = self.build_thougth_from_json(thought_json['fight_enemy_thought'], entities_collection)
        return self._thought_factory.build_defend_teritory(fight_enemy_thought=fight_enemy_thought, searching_walk_thought=searching_walk_thought, flags=thought_json['flags'], sayback=thought_json['sayback'])
    
    def _build_attack_nest_thought(self, thought_json, entities_collection: EntityCollection):
        nest = entities_collection.get_entity_by_id(thought_json['nest_id'])
        return self._thought_factory.build_attack_nest_thought(nest=nest, flags=thought_json['flags'], sayback=thought_json['sayback'])
    
    def _build_fight_enemy_thought(self, thought_json, entities_collection: EntityCollection):
        enemy = entities_collection.get_entity_by_id(thought_json['enemy_id']) if thought_json['enemy_id'] else None
        return self._thought_factory.build_fight_enemy_thought(enemy, flags=thought_json['flags'], sayback=thought_json['sayback'])