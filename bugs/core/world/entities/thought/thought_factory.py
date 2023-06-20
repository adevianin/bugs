from core.world.entities.base.live_entity.body import Body
from core.world.entities.map import Map
from core.world.utils.point import Point
from core.world.entities.base.live_entity.memory import Memory
from core.world.entities.food.food import Food

from core.world.entities.nest.nest import Nest

from core.world.entities.base.live_entity.thoughts.go_in_nest import GoInNestThought
from core.world.entities.base.live_entity.thoughts.walk_to_thought import WalkToThought
from core.world.entities.ant.base.thoughts.searching_walk_thought import SearchingWalkThought
from core.world.entities.ant.base.thoughts.find_food_thought import FindFoodThought
from core.world.entities.ant.base.thoughts.collect_food_thought import CollectFoodThought
from core.world.entities.ant.base.thoughts.feed_myself_thought import FeedMyselfThought
from core.world.entities.ant.base.thoughts.prepare_for_opertation_thought import PrepareForOperationThought
from core.world.entities.ant.queen.thoughts.build_nest_thought import BuildNestThought

class ThoughtFactory:

    def __init__(self, map: Map) -> None:
        self._map = map

    def build_thougth_from_json(self, body: Body, memory: Memory, thought_json: dict):
        match thought_json['type']:
            case 'go_in_nest':
                nest = self._map.get_entity_by_id(thought_json['nest_id'])
                return self.build_go_in_nest_thought(body=body, nest=nest, flags=thought_json['flags'], sayback=thought_json['sayback'])
            case 'walk_to':
                position = Point(thought_json['position'][0], thought_json['position'][1])
                return self.build_walk_to_thought(body=body, position=position, flags=thought_json['flags'], sayback=thought_json['sayback'])
            case 'searching_walk':
                search_near_point = Point(thought_json['search_near_point'][0], thought_json['search_near_point'][1])
                return self.build_searching_walk_thought(body=body, search_near_point=search_near_point, search_radius=thought_json['search_radius'], flags=thought_json['flags'], sayback=thought_json['sayback'])
            case 'find_food':
                searching_walk_subthought = self.build_thougth_from_json(body, memory, thought_json['searching_walk'])
                return self.build_find_food_thought(body=body, memory=memory, searching_walk_subthought=searching_walk_subthought, flags=thought_json['flags'], sayback=thought_json['sayback'])
            case 'collect_food':
                nest = self._map.get_entity_by_id(thought_json['nest_id'])
                find_food_thought = self.build_thougth_from_json(body, memory, thought_json['find_food_thought'])
                go_home_thought = self.build_thougth_from_json(body, memory, thought_json['go_home_thought'])
                found_food = self._map.get_entity_by_id(thought_json['found_food_id']) if thought_json['found_food_id'] else None
                return self.build_collect_food_thought(body=body, nest=nest, find_food_thought=find_food_thought, go_gome_thought=go_home_thought, found_food=found_food, flags=thought_json['flags'], sayback=thought_json['sayback'])
            case 'feed_myself':
                home = self._map.get_entity_by_id(thought_json['home_id'])
                found_food = self._map.get_entity_by_id(thought_json['found_food_id']) if thought_json['found_food_id'] else None
                find_food_thought = self.build_thougth_from_json(body, memory, thought_json['find_food_thought'])
                go_home_thought = self.build_thougth_from_json(body, memory, thought_json['go_home_thought'])
                return self.build_feed_myself_thought(body=body, home=home, find_food_thought=find_food_thought, go_home_thought=go_home_thought, found_food=found_food, flags=thought_json['flags'], sayback=thought_json['sayback'])
            case 'prepare_for_operation':
                feed_myself_thought = self.build_thougth_from_json(body, memory, thought_json['feed_myself_thought'])
                assemble_point = Point(thought_json['assemble_point'][0], thought_json['assemble_point'][1])
                return self.build_prepare_for_operation_thought(body=body, feed_myself_thought=feed_myself_thought, assemble_point=assemble_point, flags=thought_json['flags'], sayback=thought_json['sayback'])


    def build_go_in_nest_thought(self, body: Body, nest: Nest, flags: dict = None, sayback: str = None):
        return GoInNestThought(body=body, map=self._map, flags=flags, sayback=sayback, nest=nest)
    
    def build_walk_to_thought(self, body: Body, position: Point, flags: dict = None, sayback: str = None):
        return WalkToThought(body=body, map=self._map, flags=flags, sayback=sayback, position=position)
    
    def build_searching_walk_thought(self, body: Body, search_near_point: Point, search_radius: int, flags: dict = None, sayback: str = None):
        return SearchingWalkThought(body=body, map=self._map, search_near_point=search_near_point, search_radius=search_radius, flags=flags, sayback=sayback)

    # def build_find_entity_by_type_thought(self, entity_type: EntityTypes, search_near_point: Point, search_radius: int) -> FindEntityByTypeThought:
    #     searching_walk_subthought = self.build_searching_walk_thought(search_near_point, search_radius)
    #     return FindEntityByTypeThought(self._body, self._map, entity_type, searching_walk_subthought)

    # maybe not needed
    def build_find_food_full_thought(self, body: Body, memory: Memory, search_near_point: Point, search_radius: int, flags: dict = None, sayback: str = None):
        searching_walk_subthought = self.build_searching_walk_thought(body, search_near_point, search_radius)
        return self.build_find_food_thought(body=body, memory=memory, searching_walk_subthought=searching_walk_subthought, flags=flags, sayback=sayback)
    
    def build_find_food_thought(self, body: Body, memory: Memory, searching_walk_subthought: SearchingWalkThought, flags: dict = None, sayback: str = None):
        return FindFoodThought(body=body, map=self._map, memory=memory, random_walk_thought=searching_walk_subthought, flags=flags, sayback=sayback)
    
    def build_collect_food_full_thought(self, body: Body, memory: Memory, nest: Nest):
        find_food_thought = self.build_find_food_full_thought(body=body, memory=memory, search_near_point=nest.position, search_radius=nest.area)
        go_gome_thought = self.build_go_in_nest_thought(body=body, nest=nest)
        return self.build_collect_food_thought(body=body, nest=nest, find_food_thought=find_food_thought, go_gome_thought=go_gome_thought)
    
    def build_collect_food_thought(self, body: Body, nest: Nest, find_food_thought: FindFoodThought, go_gome_thought: GoInNestThought, found_food: Food = None, flags: dict = None, sayback: str = None):
        return CollectFoodThought(body=body, map=self._map, nest=nest, find_food_thought=find_food_thought, go_home_thought=go_gome_thought, found_food=found_food, flags=flags, sayback=sayback)
    
    def build_feed_myself_full_thought(self, body: Body, home: Nest, memory: Memory):
        find_food_thought = self.build_find_food_full_thought(body=body, memory=memory, search_near_point=home.position, search_radius=home.area)
        go_home_thought = self.build_go_in_nest_thought(body=body, nest=home)
        return self.build_feed_myself_thought(body=body, home=home, find_food_thought=find_food_thought, go_home_thought=go_home_thought)
    
    def build_feed_myself_thought(self, body: Body, home: Nest, find_food_thought: FindFoodThought, go_home_thought: GoInNestThought, found_food: Food = None, flags: dict = None, sayback: str = None):
        return FeedMyselfThought(body=body, map=self._map, home=home, find_food_thought=find_food_thought, go_home_thought=go_home_thought, found_food=found_food, flags=flags, sayback=sayback)

    def build_prepare_for_operation_full_thought(self, body: Body, home: Nest, memory: Memory, assemble_point: Point, flags: dict = None, sayback: str = None):
        feed_myself_thought = self.build_feed_myself_full_thought(body=body, home=home, memory=memory)
        return self.build_prepare_for_operation_thought(body=body, feed_myself_thought=feed_myself_thought, assemble_point=assemble_point, flags=flags, sayback=sayback)
    
    def build_prepare_for_operation_thought(self, body: Body, feed_myself_thought: FeedMyselfThought, assemble_point: Point, flags: dict = None, sayback: str = None):
        return PrepareForOperationThought(body=body, map=self._map, feed_myself_thought=feed_myself_thought, assemble_point=assemble_point, flags=flags, sayback=sayback)
    
    def build_build_new_nest_thought(self, body: Body, new_nest: Nest, flags: dict = None, sayback: str = None):
        return BuildNestThought(body=body, new_nest=new_nest, sayback=sayback)
    
    # def build_patrolling_nest_territory_thought(self, nest: Nest):
    #     searching_thought = self.build_searching_walk_thought(nest.position, nest.area)
    #     return PatrollingTerritoryThought(self._body, self._map, searching_thought)

    