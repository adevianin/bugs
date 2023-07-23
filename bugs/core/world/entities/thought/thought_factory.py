from core.world.utils.point import Point
from core.world.entities.food.food import Food
from core.world.entities.nest.nest import Nest
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.base.live_entity.thoughts.go_in_nest import GoInNestThought
from core.world.entities.base.live_entity.thoughts.walk_to_thought import WalkToThought
from core.world.entities.ant.base.thoughts.searching_walk_thought import SearchingWalkThought
from core.world.entities.ant.base.thoughts.find_food_thought import FindFoodThought
from core.world.entities.ant.base.thoughts.collect_food_thought import CollectFoodThought
from core.world.entities.ant.base.thoughts.feed_myself_thought import FeedMyselfThought
from core.world.entities.ant.base.thoughts.prepare_for_opertation_thought import PrepareForOperationThought
from core.world.entities.ant.base.thoughts.found_nest_thought import FoundNestThought
from core.world.entities.ant.base.thoughts.build_nest_thought import BuildNestThought
from core.world.entities.ant.warrior.thoughts.patrolling_territory_thought import PatrollingTerritoryThought
from core.world.entities.ant.base.thoughts.attack_nest import AttackNestThought

class ThoughtFactory:

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_go_in_nest_thought(self, nest: Nest, flags: dict = None, sayback: str = None):
        return GoInNestThought(flags=flags, sayback=sayback, nest=nest)
    
    def build_walk_to_thought(self, position: Point, flags: dict = None, sayback: str = None):
        return WalkToThought(flags=flags, sayback=sayback, position=position)
    
    def build_searching_walk_thought(self, search_near_point: Point, search_radius: int, flags: dict = None, sayback: str = None):
        return SearchingWalkThought(search_near_point=search_near_point, search_radius=search_radius, flags=flags, sayback=sayback)
    
    def build_find_food_thought(self, searching_walk_subthought: SearchingWalkThought, flags: dict = None, sayback: str = None):
        return FindFoodThought(random_walk_thought=searching_walk_subthought, flags=flags, sayback=sayback)
    
    def build_collect_food_thought(self, nest: Nest, find_food_thought: FindFoodThought, go_gome_thought: GoInNestThought, found_food: Food = None, flags: dict = None, sayback: str = None):
        return CollectFoodThought(nest=nest, find_food_thought=find_food_thought, go_home_thought=go_gome_thought, found_food=found_food, flags=flags, sayback=sayback)
    
    def build_feed_myself_thought(self, home: Nest, find_food_thought: FindFoodThought, go_home_thought: GoInNestThought, found_food: Food = None, flags: dict = None, sayback: str = None):
        return FeedMyselfThought(home=home, find_food_thought=find_food_thought, go_home_thought=go_home_thought, found_food=found_food, flags=flags, sayback=sayback)

    def build_prepare_for_operation_thought(self, feed_myself_thought: FeedMyselfThought, assemble_point: Point, flags: dict = None, sayback: str = None):
        return PrepareForOperationThought(feed_myself_thought=feed_myself_thought, assemble_point=assemble_point, flags=flags, sayback=sayback)
    
    def build_found_nest_thought(self, building_site: Point, from_colony_id: int, found_nest: Nest = None, flags: dict = None, sayback: str = None):
        return FoundNestThought(event_bus=self._event_bus, building_site=building_site, from_colony_id=from_colony_id, found_nest=found_nest, flags=flags, sayback=sayback)
    
    def build_build_nest_thought(self, building_nest: Nest, flags: dict = None, sayback: str = None):
        return BuildNestThought(building_nest=building_nest, flags=flags, sayback=sayback)
    
    def build_patroling_teritory(self, searching_walk_thought: SearchingWalkThought, flags: dict = None, sayback: str = None):
        return PatrollingTerritoryThought(search_walk_thought=searching_walk_thought, flags=flags, sayback=sayback)
    
    def build_attack_nest_thought(self, nest: Nest, flags: dict = None, sayback: str = None):
        return AttackNestThought(nest=nest, flags=flags, sayback=sayback)
    
    def build_feed_myself_full(self, home_nest: Nest, sayback: str = None):
        searching_walk_thought = self.build_searching_walk_thought(home_nest.position, home_nest.area)
        find_food_thought = self.build_find_food_thought(searching_walk_thought)
        go_home_thought = self.build_go_in_nest_thought(home_nest)
        return self.build_feed_myself_thought(home=home_nest, find_food_thought=find_food_thought, go_home_thought=go_home_thought, sayback=sayback)
    
    def build_collect_food_full(self, home_nest: Nest, sayback: str = None):
        searching_walk_thought = self.build_searching_walk_thought(home_nest.position, home_nest.area)
        find_food_thought = self.build_find_food_thought(searching_walk_thought)
        go_home_thought = self.build_go_in_nest_thought(home_nest)
        return self.build_collect_food_thought(home_nest, find_food_thought, go_home_thought, sayback=sayback)
    
    def build_prepare_for_operation_full(self, home_nest: Nest, assemble_point: Point, sayback: str = None):
        feed_myself_thought = self.build_feed_myself_full(home_nest=home_nest)
        return self.build_prepare_for_operation_thought(feed_myself_thought=feed_myself_thought, assemble_point=assemble_point, sayback=sayback)
    
    def build_patrolling_nest_territory_full(self, nest: Nest, sayback: str = None):
        searching_walk_thought = self.build_searching_walk_thought(nest.position, nest.area)
        return self.build_patroling_teritory(searching_walk_thought=searching_walk_thought, sayback=sayback)

    