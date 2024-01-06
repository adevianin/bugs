from core.world.entities.thought.thought_factory import ThoughtFactory
from core.world.utils.point import Point
from core.world.entities.base.entity_collection import EntityCollection
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.base.live_entity.live_body import LiveBody

class JsonThoughtFactory():

    def __init__(self, thought_factory: ThoughtFactory):
        self._thought_factory = thought_factory

    def build_thougth_from_json(self, body: LiveBody, thought_json: dict, entities_collection: EntityCollection):
        match thought_json['type']:
            case ThoughtTypes.GO_IN_NEST:
                return self._build_go_in_nest_thought(body, thought_json, entities_collection)
            case ThoughtTypes.WALK_TO:
                return self._build_walk_to_thought(body, thought_json, entities_collection)
            case ThoughtTypes.FIND_FOOD:
                return self._build_find_food_thought(body, thought_json, entities_collection)
            case ThoughtTypes.COLLECT_FOOD:
                return self._build_collect_food_thought(body, thought_json, entities_collection)
            case ThoughtTypes.FEED_MYSELF:
                return self._build_feed_myself_thought(body, thought_json, entities_collection)
            case ThoughtTypes.PREPARE_FOR_OPERATION:
                return self._build_prepare_for_operation_thought(body, thought_json, entities_collection)
            case ThoughtTypes.BUILD_NEST:
                return self._build_build_nest_thought(body, thought_json, entities_collection)
            case ThoughtTypes.DEFEND_TERRITORY:
                return self._build_defend_territory(body, thought_json, entities_collection)
            case ThoughtTypes.ATTACK_NEST:
                return self._build_attack_nest_thought(body, thought_json, entities_collection)
            case ThoughtTypes.FIGHT_ENEMY:
                return self._build_fight_enemy_thought(body, thought_json, entities_collection)
            case ThoughtTypes.FIGHT_NEAR_ENEMIES:
                return self._build_fight_near_enemies(body, thought_json, entities_collection)
            case ThoughtTypes.REINFORCE_NEST_DEFENCE:
                return self._build_reinforce_nest_defence(body, thought_json, entities_collection)
            case ThoughtTypes.RANDOM_WALK:
                return self._build_random_walk(body, thought_json, entities_collection)
            case ThoughtTypes.HUNT_FOR_APHID:
                return self._build_hynt_for_aphid(body, thought_json, entities_collection)
            case _:
                raise Exception('unknown type of thought')
            
    def _build_go_in_nest_thought(self, body: LiveBody, thought_json, entities_collection: EntityCollection):
        nest = entities_collection.get_entity_by_id(thought_json['nest_id'])
        return self._thought_factory.build_go_in_nest_thought(body=body, nest=nest, flags=thought_json['flags'], sayback=thought_json['sayback'])
    
    def _build_walk_to_thought(self, body: LiveBody, thought_json, entities_collection: EntityCollection):
        position = Point(thought_json['position'][0], thought_json['position'][1])
        return self._thought_factory.build_walk_to_thought(body=body, position=position, flags=thought_json['flags'], sayback=thought_json['sayback'])
    
    def _build_find_food_thought(self, body: LiveBody, thought_json, entities_collection: EntityCollection):
        random_walk_thought = self.build_thougth_from_json(body, thought_json['random_walk_thought'], entities_collection)
        return self._thought_factory.build_find_food_thought(body=body, random_walk_thought=random_walk_thought, flags=thought_json['flags'], sayback=thought_json['sayback'])
    
    def _build_collect_food_thought(self, body: LiveBody, thought_json, entities_collection: EntityCollection):
        nest = entities_collection.get_entity_by_id(thought_json['nest_id'])
        random_walk_thought = self.build_thougth_from_json(body, thought_json['random_walk_thought'], entities_collection)
        go_home_thought = self.build_thougth_from_json(body, thought_json['go_home_thought'], entities_collection)
        found_food = entities_collection.get_entity_by_id(thought_json['found_food_id']) if thought_json['found_food_id'] else None
        return self._thought_factory.build_collect_food_thought(body=body, nest=nest, random_walk_thought=random_walk_thought, go_gome_thought=go_home_thought, found_food=found_food, flags=thought_json['flags'], sayback=thought_json['sayback'])

    def _build_feed_myself_thought(self, body: LiveBody, thought_json, entities_collection: EntityCollection):
        home = entities_collection.get_entity_by_id(thought_json['home_id'])
        found_food = entities_collection.get_entity_by_id(thought_json['found_food_id']) if thought_json['found_food_id'] else None
        find_food_thought = self.build_thougth_from_json(body, thought_json['find_food_thought'], entities_collection)
        go_home_thought = self.build_thougth_from_json(body, thought_json['go_home_thought'], entities_collection)
        return self._thought_factory.build_feed_myself_thought(body=body, home=home, find_food_thought=find_food_thought, go_home_thought=go_home_thought, found_food=found_food, flags=thought_json['flags'], sayback=thought_json['sayback'])
    
    def _build_prepare_for_operation_thought(self, body: LiveBody, thought_json, entities_collection: EntityCollection):
        feed_myself_thought = self.build_thougth_from_json(body, thought_json['feed_myself_thought'], entities_collection)
        assemble_point = Point(thought_json['assemble_point'][0], thought_json['assemble_point'][1])
        return self._thought_factory.build_prepare_for_operation_thought(body=body, feed_myself_thought=feed_myself_thought, assemble_point=assemble_point, flags=thought_json['flags'], sayback=thought_json['sayback'])
    
    def _build_build_nest_thought(self, body: LiveBody, thought_json, entities_collection: EntityCollection):
        building_nest = entities_collection.get_entity_by_id(thought_json['building_nest_id'])
        return self._thought_factory.build_build_nest_thought(body=body, building_nest=building_nest, flags=thought_json['flags'], sayback=thought_json['sayback'])
    
    def _build_defend_territory(self, body: LiveBody, thought_json, entities_collection: EntityCollection):
        random_walk_thought = self.build_thougth_from_json(body, thought_json['random_walk_thought'], entities_collection)
        fight_near_enemies_thought = self.build_thougth_from_json(body, thought_json['fight_near_enemies_thought'], entities_collection)
        defending_nest = entities_collection.get_entity_by_id(thought_json['defending_nest_id'])
        point_to_check = Point.from_json(thought_json['point_to_check']) if thought_json['point_to_check'] else None
        return self._thought_factory.build_defend_teritory(body=body, fight_near_enemies_thought=fight_near_enemies_thought, random_walk_thought=random_walk_thought, defending_nest=defending_nest, point_to_check=point_to_check, flags=thought_json['flags'], sayback=thought_json['sayback'])
    
    def _build_attack_nest_thought(self, body: LiveBody, thought_json, entities_collection: EntityCollection):
        nest = entities_collection.get_entity_by_id(thought_json['nest_id'])
        fight_near_enemies_thought = self.build_thougth_from_json(body, thought_json['fight_near_enemies_thought'], entities_collection)
        return self._thought_factory.build_attack_nest_thought(body=body, fight_near_enemies_thought=fight_near_enemies_thought, nest=nest, flags=thought_json['flags'], sayback=thought_json['sayback'])
    
    def _build_fight_enemy_thought(self, body: LiveBody, thought_json, entities_collection: EntityCollection):
        enemy = entities_collection.get_entity_by_id(thought_json['enemy_id']) if thought_json['enemy_id'] else None
        return self._thought_factory.build_fight_enemy_thought(body, enemy, flags=thought_json['flags'], sayback=thought_json['sayback'])
    
    def _build_fight_near_enemies(self, body: LiveBody, thought_json, entities_collection: EntityCollection):
        fight_enemy_thought = self.build_thougth_from_json(body, thought_json['fight_enemy_thought'], entities_collection)
        return self._thought_factory.build_fight_near_enemies_thought(body=body, fight_enemy_thought=fight_enemy_thought, flags=thought_json['flags'], sayback=thought_json['sayback'])
    
    def _build_reinforce_nest_defence(self, body: LiveBody, thought_json, entities_collection: EntityCollection):
        random_walk_thought = self.build_thougth_from_json(body, thought_json['random_walk_thought'], entities_collection)
        fight_near_enemies_thought = self.build_thougth_from_json(body, thought_json['fight_near_enemies_thought'], entities_collection)
        defending_nest = entities_collection.get_entity_by_id(thought_json['defending_nest_id'])
        point_to_check = Point.from_json(thought_json['point_to_check'])
        return self._thought_factory.build_reinforce_nest_defence_thought(body=body, fight_near_enemies_thought=fight_near_enemies_thought, random_walk_thought=random_walk_thought, defending_nest=defending_nest, point_to_check=point_to_check, flags=thought_json['flags'], sayback=thought_json['sayback'])
    
    def _build_random_walk(self, body: LiveBody, thought_json, entities_collection: EntityCollection):
        center = Point.from_json(thought_json['center']) if thought_json['center'] else None
        radius = thought_json['radius'] or None
        return self._thought_factory.build_random_walk_thought(body=body, center=center, radius=radius, flags=thought_json['flags'], sayback=thought_json['sayback'])
    
    def _build_hynt_for_aphid(self, body: LiveBody, thought_json, entities_collection: EntityCollection):
        random_walk_thought = self.build_thougth_from_json(body, thought_json['random_walk_thought'], entities_collection)
        fight_near_enemies_thought = self.build_thougth_from_json(body, thought_json['fight_near_enemies_thought'], entities_collection)
        found_food_source = entities_collection.get_entity_by_id(thought_json['found_food_source_id']) if thought_json['found_food_source_id'] else None
        return self._thought_factory.build_hunt_for_aphid(body=body, random_walk_thought=random_walk_thought, fight_near_enemies_thought=fight_near_enemies_thought, found_food_source=found_food_source, flags=thought_json['flags'], sayback=thought_json['sayback'])
    