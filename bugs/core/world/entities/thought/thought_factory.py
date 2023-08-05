from core.world.entities.base.live_entity.body import Body
from core.world.utils.point import Point
from core.world.entities.food.food import Food
from core.world.entities.nest.nest import Nest
from core.world.entities.base.enemy_interface import iEnemy
from core.world.entities.base.live_entity.thoughts.go_in_nest import GoInNestThought
from core.world.entities.base.live_entity.thoughts.walk_to_thought import WalkToThought
from core.world.entities.ant.base.thoughts.searching_walk_thought import SearchingWalkThought
from core.world.entities.ant.base.thoughts.find_food_thought import FindFoodThought
from core.world.entities.ant.base.thoughts.collect_food_thought import CollectFoodThought
from core.world.entities.ant.base.thoughts.feed_myself_thought import FeedMyselfThought
from core.world.entities.ant.base.thoughts.prepare_for_opertation_thought import PrepareForOperationThought
from core.world.entities.ant.base.thoughts.found_nest_thought import FoundNestThought
from core.world.entities.ant.base.thoughts.build_nest_thought import BuildNestThought
from core.world.entities.ant.warrior.thoughts.defend_territory_thought import DefendTerritoryThought
from core.world.entities.ant.base.thoughts.attack_nest_thought import AttackNestThought
from core.world.entities.base.live_entity.thoughts.fight_enemy_thought import FightEnemyThought
from core.world.entities.base.live_entity.thoughts.fight_near_enemies_thought import FightNearEnemiesThought
from core.world.entities.ant.base.thoughts.reinforce_nest_defence_thought import ReinforceNestDefenceThought

class ThoughtFactory:

    def build_go_in_nest_thought(self, body: Body, nest: Nest, flags: dict = None, sayback: str = None):
        return GoInNestThought(body=body, flags=flags, sayback=sayback, nest=nest)
    
    def build_walk_to_thought(self, body: Body, position: Point, flags: dict = None, sayback: str = None):
        return WalkToThought(body=body, flags=flags, sayback=sayback, position=position)
    
    def build_searching_walk_thought(self, body: Body, search_near_point: Point, search_radius: int, flags: dict = None, sayback: str = None):
        return SearchingWalkThought(body=body, search_near_point=search_near_point, search_radius=search_radius, flags=flags, sayback=sayback)
    
    def build_find_food_thought(self, body: Body, searching_walk_subthought: SearchingWalkThought, flags: dict = None, sayback: str = None):
        return FindFoodThought(body=body, random_walk_thought=searching_walk_subthought, flags=flags, sayback=sayback)
    
    def build_collect_food_thought(self, body: Body, nest: Nest, find_food_thought: FindFoodThought, go_gome_thought: GoInNestThought, found_food: Food = None, flags: dict = None, sayback: str = None):
        return CollectFoodThought(body=body, nest=nest, find_food_thought=find_food_thought, go_home_thought=go_gome_thought, found_food=found_food, flags=flags, sayback=sayback)
    
    def build_feed_myself_thought(self, body: Body, home: Nest, find_food_thought: FindFoodThought, go_home_thought: GoInNestThought, found_food: Food = None, flags: dict = None, sayback: str = None):
        return FeedMyselfThought(body=body, home=home, find_food_thought=find_food_thought, go_home_thought=go_home_thought, found_food=found_food, flags=flags, sayback=sayback)

    def build_prepare_for_operation_thought(self, body: Body, feed_myself_thought: FeedMyselfThought, assemble_point: Point, flags: dict = None, sayback: str = None):
        return PrepareForOperationThought(body=body, feed_myself_thought=feed_myself_thought, assemble_point=assemble_point, flags=flags, sayback=sayback)
    
    def build_found_nest_thought(self, body: Body, building_site: Point, from_colony_id: int, found_nest: Nest = None, flags: dict = None, sayback: str = None):
        return FoundNestThought(body=body, building_site=building_site, from_colony_id=from_colony_id, found_nest=found_nest, flags=flags, sayback=sayback)
    
    def build_build_nest_thought(self, body: Body, building_nest: Nest, flags: dict = None, sayback: str = None):
        return BuildNestThought(body=body, building_nest=building_nest, flags=flags, sayback=sayback)
    
    def build_defend_teritory(self, body: Body, fight_near_enemies_thought: FightNearEnemiesThought, searching_walk_thought: SearchingWalkThought, defending_nest: Nest, point_to_check: Point = None, flags: dict = None, sayback: str = None):
        return DefendTerritoryThought(body=body, fight_near_enemies_thought=fight_near_enemies_thought, search_walk_thought=searching_walk_thought, defending_nest=defending_nest, point_to_check=point_to_check, flags=flags, sayback=sayback)
    
    def build_attack_nest_thought(self, body: Body, fight_near_enemies_thought: FightNearEnemiesThought, nest: Nest, flags: dict = None, sayback: str = None):
        return AttackNestThought(body=body, fight_near_enemies_thought=fight_near_enemies_thought, nest=nest, flags=flags, sayback=sayback)
    
    def build_fight_enemy_thought(self, body: Body, enemy: iEnemy, flags: dict = None, sayback: str = None):
        return FightEnemyThought(body=body, enemy=enemy, flags=flags, sayback=sayback)
    
    def build_fight_near_enemies_thought(self, body: Body, fight_enemy_thought: FightEnemyThought, flags: dict = None, sayback: str = None):
        return FightNearEnemiesThought(body=body, fight_enemy_thought=fight_enemy_thought, flags=flags, sayback=sayback)
    
    def build_reinforce_nest_defence_thought(self, body: Body, fight_near_enemies_thought: FightNearEnemiesThought, searching_walk_thought: SearchingWalkThought, defending_nest: Nest, point_to_check: Point, flags: dict = None, sayback: str = None):
        return ReinforceNestDefenceThought(body=body, fight_near_enemies_thought=fight_near_enemies_thought, searching_walk_thought=searching_walk_thought, defending_nest=defending_nest, point_to_check=point_to_check, flags=flags, sayback=sayback)
    
    def build_feed_myself_full(self, body: Body, home_nest: Nest, sayback: str = None):
        searching_walk_thought = self.build_searching_walk_thought(body, home_nest.position, home_nest.area)
        find_food_thought = self.build_find_food_thought(body, searching_walk_thought)
        go_home_thought = self.build_go_in_nest_thought(body, home_nest)
        return self.build_feed_myself_thought(body=body, home=home_nest, find_food_thought=find_food_thought, go_home_thought=go_home_thought, sayback=sayback)
    
    def build_collect_food_full(self, body: Body, home_nest: Nest, sayback: str = None):
        searching_walk_thought = self.build_searching_walk_thought(body, home_nest.position, home_nest.area)
        find_food_thought = self.build_find_food_thought(body, searching_walk_thought)
        go_home_thought = self.build_go_in_nest_thought(body, home_nest)
        return self.build_collect_food_thought(body, home_nest, find_food_thought, go_home_thought, sayback=sayback)
    
    def build_prepare_for_operation_full(self, body: Body, home_nest: Nest, assemble_point: Point, sayback: str = None):
        feed_myself_thought = self.build_feed_myself_full(body=body, home_nest=home_nest)
        return self.build_prepare_for_operation_thought(body=body, feed_myself_thought=feed_myself_thought, assemble_point=assemble_point, sayback=sayback)
    
    def build_defend_nest_territory_full(self, body: Body, nest: Nest, sayback: str = None):
        searching_walk_thought = self.build_searching_walk_thought(body, nest.position, nest.area)
        fight_enemy_thought = self.build_fight_enemy_thought(body, None)
        fight_near_enemies_thought = self.build_fight_near_enemies_thought(body, fight_enemy_thought=fight_enemy_thought)
        return self.build_defend_teritory(body=body, fight_near_enemies_thought=fight_near_enemies_thought, searching_walk_thought=searching_walk_thought, defending_nest=nest, sayback=sayback)
    
    def build_attack_nest_thought_full(self, body: Body, nest: Nest, sayback: str = None):
        fight_enemy_thought = self.build_fight_enemy_thought(body, None)
        fight_near_enemies_thought = self.build_fight_near_enemies_thought(body, fight_enemy_thought=fight_enemy_thought)
        return self.build_attack_nest_thought(body=body, fight_near_enemies_thought=fight_near_enemies_thought, nest=nest, sayback=sayback)
    
    def build_reinforce_nest_defence_thought_full(self, body: Body, nest: Nest, point_to_check: Point, sayback: str = None):
        searching_walk_thought = self.build_searching_walk_thought(body, nest.position, nest.area)
        fight_enemy_thought = self.build_fight_enemy_thought(body, None)
        fight_near_enemies_thought = self.build_fight_near_enemies_thought(body=body, fight_enemy_thought=fight_enemy_thought)
        return self.build_reinforce_nest_defence_thought(body=body, fight_near_enemies_thought=fight_near_enemies_thought, searching_walk_thought=searching_walk_thought, defending_nest=nest, point_to_check=point_to_check, sayback=sayback)


    