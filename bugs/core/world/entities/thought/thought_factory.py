from core.world.utils.point import Point
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

    def build_go_in_nest_thought(self, nest: Nest, flags: dict = None, sayback: str = None):
        return GoInNestThought(flags=flags, sayback=sayback, nest=nest)
    
    def build_walk_to_thought(self, position: Point, flags: dict = None, sayback: str = None):
        return WalkToThought(flags=flags, sayback=sayback, position=position)
    
    def build_searching_walk_thought(self, search_near_point: Point, search_radius: int, flags: dict = None, sayback: str = None):
        return SearchingWalkThought(search_near_point=search_near_point, search_radius=search_radius, flags=flags, sayback=sayback)

    # def build_find_entity_by_type_thought(self, entity_type: EntityTypes, search_near_point: Point, search_radius: int) -> FindEntityByTypeThought:
    #     searching_walk_subthought = self.build_searching_walk_thought(search_near_point, search_radius)
    #     return FindEntityByTypeThought(self._body, self._map, entity_type, searching_walk_subthought)

    # maybe not needed
    def build_find_food_full_thought(self, search_near_point: Point, search_radius: int, flags: dict = None, sayback: str = None):
        searching_walk_subthought = self.build_searching_walk_thought(search_near_point, search_radius)
        return self.build_find_food_thought(searching_walk_subthought=searching_walk_subthought, flags=flags, sayback=sayback)
    
    def build_find_food_thought(self, searching_walk_subthought: SearchingWalkThought, flags: dict = None, sayback: str = None):
        return FindFoodThought(random_walk_thought=searching_walk_subthought, flags=flags, sayback=sayback)
    
    def build_collect_food_full_thought(self, nest: Nest):
        find_food_thought = self.build_find_food_full_thought(search_near_point=nest.position, search_radius=nest.area)
        go_gome_thought = self.build_go_in_nest_thought(nest=nest)
        return self.build_collect_food_thought(nest=nest, find_food_thought=find_food_thought, go_gome_thought=go_gome_thought)
    
    def build_collect_food_thought(self, nest: Nest, find_food_thought: FindFoodThought, go_gome_thought: GoInNestThought, found_food: Food = None, flags: dict = None, sayback: str = None):
        return CollectFoodThought(nest=nest, find_food_thought=find_food_thought, go_home_thought=go_gome_thought, found_food=found_food, flags=flags, sayback=sayback)
    
    def build_feed_myself_full_thought(self, home: Nest, ):
        find_food_thought = self.build_find_food_full_thought(search_near_point=home.position, search_radius=home.area)
        go_home_thought = self.build_go_in_nest_thought(nest=home)
        return self.build_feed_myself_thought(home=home, find_food_thought=find_food_thought, go_home_thought=go_home_thought)
    
    def build_feed_myself_thought(self, home: Nest, find_food_thought: FindFoodThought, go_home_thought: GoInNestThought, found_food: Food = None, flags: dict = None, sayback: str = None):
        return FeedMyselfThought(home=home, find_food_thought=find_food_thought, go_home_thought=go_home_thought, found_food=found_food, flags=flags, sayback=sayback)

    def build_prepare_for_operation_full_thought(self, home: Nest, assemble_point: Point, flags: dict = None, sayback: str = None):
        feed_myself_thought = self.build_feed_myself_full_thought(home=home)
        return self.build_prepare_for_operation_thought(feed_myself_thought=feed_myself_thought, assemble_point=assemble_point, flags=flags, sayback=sayback)
    
    def build_prepare_for_operation_thought(self, feed_myself_thought: FeedMyselfThought, assemble_point: Point, flags: dict = None, sayback: str = None):
        return PrepareForOperationThought(feed_myself_thought=feed_myself_thought, assemble_point=assemble_point, flags=flags, sayback=sayback)
    
    def build_build_new_nest_thought(self, new_nest: Nest, flags: dict = None, sayback: str = None):
        return BuildNestThought(new_nest=new_nest, sayback=sayback)
    
    # def build_patrolling_nest_territory_thought(self, nest: Nest):
    #     searching_thought = self.build_searching_walk_thought(nest.position, nest.area)
    #     return PatrollingTerritoryThought(self._body, self._map, searching_thought)

    