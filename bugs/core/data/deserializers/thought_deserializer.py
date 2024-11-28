from core.world.entities.thought.thought_factory import ThoughtFactory
from core.world.utils.point import Point
from core.world.entities.base.entity_collection import EntityCollection
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.base.live_entity.live_body import LiveBody

class ThoughtDeserializer():

    def __init__(self, thought_factory: ThoughtFactory):
        self._thought_factory = thought_factory

    def deserialize_thougth(self, thought_json: dict, entities_collection: EntityCollection):
        match thought_json['type']:
            case ThoughtTypes.GO_IN_NEST:
                return self._build_go_in_nest_thought(thought_json, entities_collection)
            case ThoughtTypes.WALK_TO:
                return self._build_walk_to_thought(thought_json, entities_collection)
            case ThoughtTypes.FIND_FOOD:
                return self._build_find_food_thought(thought_json, entities_collection)
            case ThoughtTypes.COLLECT_FOOD:
                return self._build_collect_food_thought(thought_json, entities_collection)
            case ThoughtTypes.FEED_MYSELF:
                return self._build_feed_myself_thought(thought_json, entities_collection)
            case ThoughtTypes.PREPARE_FOR_OPERATION:
                return self._build_prepare_for_operation_thought(thought_json, entities_collection)
            case ThoughtTypes.BUILD_NEST:
                return self._build_build_nest_thought(thought_json, entities_collection)
            # case ThoughtTypes.DEFEND_TERRITORY:
            #     return self._build_defend_territory(thought_json, entities_collection)
            case ThoughtTypes.ATTACK_NEST:
                return self._build_attack_nest_thought(thought_json, entities_collection)
            case ThoughtTypes.FIGHT_ENEMY:
                return self._build_fight_enemy_thought(thought_json, entities_collection)
            case ThoughtTypes.FIGHT_NEAR_ENEMIES:
                return self._build_fight_near_enemies(thought_json, entities_collection)
            case ThoughtTypes.DEFEND_NEST:
                return self._build_defend_nest(thought_json, entities_collection)
            case ThoughtTypes.RANDOM_WALK:
                return self._build_random_walk(thought_json, entities_collection)
            case ThoughtTypes.HUNT_FOR_APHID:
                return self._build_hynt_for_aphid(thought_json, entities_collection)
            case ThoughtTypes.PATROL_NEST_TERRITORY:
                return self._build_patrol_nest_territory(thought_json, entities_collection)
            case ThoughtTypes.HIBERNATION:
                return self._build_hibernation(thought_json, entities_collection)
            case ThoughtTypes.LADYBUG_HIBERNATION:
                return self._build_ladybug_hibernation(thought_json, entities_collection)
            case ThoughtTypes.SHELTER_IN_NEST:
                return self._build_shelter_in_nest(thought_json, entities_collection)
            # case ThoughtTypes.GET_STAHED_ITEM_BACK:
            #     return self._build_get_stashed_item_back(thought_json, entities_collection)
            case ThoughtTypes.BUILD_FORTIFICATION:
                return self._build_build_fortification(thought_json, entities_collection)
            case ThoughtTypes.DEFEND_COLONY:
                return self._build_defend_colony(thought_json, entities_collection)
            case ThoughtTypes.DEFEND_MYSELF:
                return self._build_defend_myself(thought_json, entities_collection)
            case ThoughtTypes.KEEP_CLEAR_TERRITORY:
                return self._build_keep_clear_territory(thought_json, entities_collection)
            case ThoughtTypes.WAIT_STEP:
                return self._build_wait_step(thought_json, entities_collection)
            case _:
                raise Exception('unknown type of thought')
            
    def _build_go_in_nest_thought(self, thought_json, entities_collection: EntityCollection):
        nest = entities_collection.get_entity_by_id(thought_json['nest_id'])
        return self._thought_factory.build_go_in_nest_thought(nest=nest, flags=thought_json['flags'], sayback=thought_json['sayback'])
    
    def _build_walk_to_thought(self, thought_json, entities_collection: EntityCollection):
        position = Point(thought_json['position'][0], thought_json['position'][1])
        return self._thought_factory.build_walk_to_thought(position=position, flags=thought_json['flags'], sayback=thought_json['sayback'])
    
    def _build_find_food_thought(self, thought_json, entities_collection: EntityCollection):
        random_walk_thought = self.deserialize_thougth(thought_json['random_walk_thought'], entities_collection)
        return self._thought_factory.build_find_food_thought(random_walk_thought=random_walk_thought, flags=thought_json['flags'], sayback=thought_json['sayback'])
    
    def _build_collect_food_thought(self, thought_json, entities_collection: EntityCollection):
        nest = entities_collection.get_entity_by_id(thought_json['nest_id'])
        random_walk_thought = self.deserialize_thougth(thought_json['random_walk_thought'], entities_collection)
        go_home_thought = self.deserialize_thougth(thought_json['go_home_thought'], entities_collection)
        found_food = entities_collection.get_entity_by_id(thought_json['found_food_id']) if thought_json['found_food_id'] else None
        return self._thought_factory.build_collect_food_thought(nest=nest, random_walk_thought=random_walk_thought, go_gome_thought=go_home_thought, found_food=found_food, flags=thought_json['flags'], sayback=thought_json['sayback'])

    def _build_feed_myself_thought(self, thought_json, entities_collection: EntityCollection):
        home = entities_collection.get_entity_by_id(thought_json['home_id'])
        go_home_thought = self.deserialize_thougth(thought_json['go_home_thought'], entities_collection)
        return self._thought_factory.build_feed_myself_thought(home, go_home_thought, thought_json['flags'], thought_json['sayback'])
    
    def _build_prepare_for_operation_thought(self, thought_json, entities_collection: EntityCollection):
        feed_myself_thought = self.deserialize_thougth(thought_json['feed_myself_thought'], entities_collection)
        assemble_point = Point(thought_json['assemble_point'][0], thought_json['assemble_point'][1])
        return self._thought_factory.build_prepare_for_operation_thought(feed_myself_thought=feed_myself_thought, assemble_point=assemble_point, flags=thought_json['flags'], sayback=thought_json['sayback'])
    
    def _build_build_nest_thought(self, thought_json, entities_collection: EntityCollection):
        building_nest = entities_collection.get_entity_by_id(thought_json['building_nest_id'])
        build_build_nest_thought = thought_json['get_inside_once_done']
        return self._thought_factory.build_build_nest_thought(building_nest=building_nest, get_inside_once_done=build_build_nest_thought, flags=thought_json['flags'], sayback=thought_json['sayback'])
    
    # def _build_defend_territory(self, thought_json, entities_collection: EntityCollection):
    #     random_walk_thought = self.build_thougth_from_json(thought_json['random_walk_thought'], entities_collection)
    #     fight_near_enemies_thought = self.build_thougth_from_json(thought_json['fight_near_enemies_thought'], entities_collection)
    #     defending_nest = entities_collection.get_entity_by_id(thought_json['defending_nest_id'])
    #     point_to_check = Point.from_json(thought_json['point_to_check']) if thought_json['point_to_check'] else None
    #     return self._thought_factory.build_defend_teritory(fight_near_enemies_thought=fight_near_enemies_thought, random_walk_thought=random_walk_thought, defending_nest=defending_nest, point_to_check=point_to_check, flags=thought_json['flags'], sayback=thought_json['sayback'])
    
    def _build_attack_nest_thought(self, thought_json, entities_collection: EntityCollection):
        nest = entities_collection.get_entity_by_id(thought_json['nest_id'])
        fight_near_enemies_thought = self.deserialize_thougth(thought_json['fight_near_enemies_thought'], entities_collection)
        return self._thought_factory.build_attack_nest_thought(fight_near_enemies_thought=fight_near_enemies_thought, nest=nest, flags=thought_json['flags'], sayback=thought_json['sayback'])
    
    def _build_fight_enemy_thought(self, thought_json, entities_collection: EntityCollection):
        enemy = entities_collection.get_entity_by_id(thought_json['enemy_id']) if thought_json['enemy_id'] else None
        return self._thought_factory.build_fight_enemy_thought(enemy, flags=thought_json['flags'], sayback=thought_json['sayback'])
    
    def _build_fight_near_enemies(self, thought_json, entities_collection: EntityCollection):
        fight_enemy_thought = self.deserialize_thougth(thought_json['fight_enemy_thought'], entities_collection)
        return self._thought_factory.build_fight_near_enemies_thought(fight_enemy_thought=fight_enemy_thought, flags=thought_json['flags'], sayback=thought_json['sayback'])
    
    def _build_defend_nest(self, thought_json, entities_collection: EntityCollection):
        fight_near_enemies_thought = self.deserialize_thougth(thought_json['fight_near_enemies_thought'], entities_collection)
        defending_nest = entities_collection.get_entity_by_id(thought_json['defending_nest_id'])
        point_to_check = Point.from_json(thought_json['point_to_check'])
        return self._thought_factory.build_defend_nest_thought(fight_near_enemies_thought=fight_near_enemies_thought, defending_nest=defending_nest, point_to_check=point_to_check, flags=thought_json['flags'], sayback=thought_json['sayback'])
    
    def _build_random_walk(self, thought_json, entities_collection: EntityCollection):
        center = Point.from_json(thought_json['center']) if thought_json['center'] else None
        radius = thought_json['radius'] or None
        return self._thought_factory.build_random_walk_thought(center=center, radius=radius, flags=thought_json['flags'], sayback=thought_json['sayback'])
    
    def _build_hynt_for_aphid(self, thought_json, entities_collection: EntityCollection):
        random_walk_thought = self.deserialize_thougth(thought_json['random_walk_thought'], entities_collection)
        fight_near_enemies_thought = self.deserialize_thougth(thought_json['fight_near_enemies_thought'], entities_collection)
        found_food_source = entities_collection.get_entity_by_id(thought_json['found_food_source_id']) if thought_json['found_food_source_id'] else None
        return self._thought_factory.build_hunt_for_aphid(random_walk_thought=random_walk_thought, fight_near_enemies_thought=fight_near_enemies_thought, found_food_source=found_food_source, flags=thought_json['flags'], sayback=thought_json['sayback'])
    
    def _build_patrol_nest_territory(self, thought_json, entities_collection: EntityCollection):
        random_walk_thought = self.deserialize_thougth(thought_json['random_walk_thought'], entities_collection)
        nest = entities_collection.get_entity_by_id(thought_json['nest_id'])
        step_count = thought_json['step_count']
        flags = thought_json['flags']
        sayback = thought_json['sayback']
        return self._thought_factory.build_patrol_nest_territory(random_walk_thought, nest, step_count, flags, sayback)
    
    def _build_hibernation(self, thought_json, entities_collection: EntityCollection):
        go_home_thought = self.deserialize_thougth(thought_json['go_home_thought'], entities_collection)
        flags = thought_json['flags']
        sayback = thought_json['sayback']
        return self._thought_factory.build_hibernation(go_home_thought, flags, sayback)
    
    def _build_ladybug_hibernation(self, thought_json, entities_collection: EntityCollection):
        random_walk_thought = self.deserialize_thougth(thought_json['random_walk_thought'], entities_collection)
        fight_near_enemies_thought = self.deserialize_thougth(thought_json['fight_near_enemies_thought'], entities_collection)
        found_tree = entities_collection.get_entity_by_id(thought_json['found_tree_id']) if thought_json['found_tree_id'] else None
        return self._thought_factory.build_ladybug_hibernation_thought(random_walk_thought, fight_near_enemies_thought, found_tree)
    
    def _build_shelter_in_nest(self, thought_json, entities_collection: EntityCollection):
        go_home_thought = self.deserialize_thougth(thought_json['go_home_thought'], entities_collection)
        shelter_nest = entities_collection.get_entity_by_id(thought_json['shelter_nest_id'])
        flags = thought_json['flags']
        sayback = thought_json['sayback']
        return self._thought_factory.build_shelter_in_nest(go_home_thought, shelter_nest, flags, sayback)
    
    # def _build_get_stashed_item_back(self, thought_json, entities_collection: EntityCollection):
    #     flags = thought_json['flags']
    #     sayback = thought_json['sayback']
    #     return self._thought_factory.build_get_stashed_item_back(flags, sayback)
    
    def _build_build_fortification(self, thought_json, entities_collection: EntityCollection):
        flags = thought_json['flags']
        sayback = thought_json['sayback']
        random_walk_thought = self.deserialize_thougth(thought_json['random_walk_thought'], entities_collection)
        nest = entities_collection.get_entity_by_id(thought_json['nest_id'])
        return self._thought_factory.build_build_fortification(random_walk_thought, nest, flags, sayback)
    
    def _build_defend_colony(self, thought_json, entities_collection: EntityCollection):
        flags = thought_json['flags']
        sayback = thought_json['sayback']
        fight_near_enemies_thought = self.deserialize_thougth(thought_json['fight_near_enemies_thought'], entities_collection)
        point_to_check = Point.from_json(thought_json['point_to_check'])
        return self._thought_factory.build_defend_colony(fight_near_enemies_thought, point_to_check, flags, sayback)
    
    def _build_defend_myself(self, thought_json, entities_collection: EntityCollection):
        flags = thought_json['flags']
        sayback = thought_json['sayback']
        fight_near_enemies_thought = self.deserialize_thougth(thought_json['fight_near_enemies_thought'], entities_collection)
        return self._thought_factory.build_defend_myself(fight_near_enemies_thought, flags, sayback)
    
    def _build_keep_clear_territory(self, thought_json, entities_collection: EntityCollection):
        flags = thought_json['flags']
        sayback = thought_json['sayback']
        fight_near_enemies_thought = self.deserialize_thougth(thought_json['fight_near_enemies_thought'], entities_collection)
        random_walk_thought = self.deserialize_thougth(thought_json['random_walk_thought'], entities_collection)
        return self._thought_factory.build_keep_clear_territory(fight_near_enemies_thought, random_walk_thought, flags, sayback)
    
    def _build_wait_step(self, thought_json, entities_collection: EntityCollection):
        flags = thought_json['flags']
        sayback = thought_json['sayback']
        step_count = thought_json['step_count']
        return self._thought_factory.build_wait_step(step_count, flags, sayback)
    
