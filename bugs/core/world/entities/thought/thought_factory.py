from core.world.utils.point import Point
from core.world.entities.nest.nest import Nest
from core.world.entities.base.enemy_interface import iEnemy
from core.world.entities.tree.tree import Tree
from core.world.entities.base.live_entity.thoughts.go_in_nest import GoInNestThought
from core.world.entities.base.live_entity.thoughts.walk_to_thought import WalkToThought
from core.world.entities.ant.base.thoughts.find_food_thought import FindFoodThought
from core.world.entities.ant.base.thoughts.collect_food_thought import CollectFoodThought
from core.world.entities.ant.base.thoughts.feed_myself_thought import FeedMyselfThought
from core.world.entities.ant.base.thoughts.prepare_for_opertation_thought import PrepareForOperationThought
from core.world.entities.ant.base.thoughts.build_nest_thought import BuildNestThought
# from core.world.entities.ant.warrior.thoughts.defend_territory_thought import DefendTerritoryThought
from core.world.entities.ant.base.thoughts.attack_nest_thought import AttackNestThought
from core.world.entities.base.live_entity.thoughts.fight_enemy_thought import FightEnemyThought
from core.world.entities.base.live_entity.thoughts.fight_near_enemies_thought import FightNearEnemiesThought
from core.world.entities.ant.base.thoughts.defend_nest_thought import DefendNestThought
from core.world.entities.base.live_entity.thoughts.random_walk_thought import RandomWalkThought
from core.world.entities.ladybug.thoughts.hunt_for_aphid import HuntForAphid
from core.world.entities.item.items.base.item import Item
from core.world.entities.item.item_sources.base.item_source import ItemSource
from core.world.entities.ant.warrior.thoughts.keep_clear_territory_thought import KeepClearTerritoryThought
from core.world.entities.base.live_entity.thoughts.wait_step_thought import WaitStepThought
from core.world.entities.ant.warrior.thoughts.patrol_nest_territory_thought import PatrolNestTerritoryThought
from core.world.entities.ant.base.thoughts.hibernation_thought import HibernationThought
from core.world.entities.ant.base.thoughts.shelter_in_nest import ShelterInNestThought
from core.world.entities.ant.base.thoughts.build_fortification_thought import BuildFortificationThought
from core.world.entities.ant.base.thoughts.defend_colony_thought import DefendColonyThought
from core.world.entities.ant.base.thoughts.defend_myself_thought import DefendMyselfThought
from core.world.entities.ladybug.thoughts.ladybug_hibernation_thought import LadybugHibernationThought

from typing import Dict

class ThoughtFactory:

    def build_go_in_nest_thought(self, nest: Nest, flags: dict = None, sayback: str = None):
        return GoInNestThought(flags=flags, sayback=sayback, nest=nest)
    
    def build_walk_to_thought(self, position: Point, flags: dict = None, sayback: str = None):
        return WalkToThought(flags=flags, sayback=sayback, position=position)
    
    def build_find_food_thought(self, random_walk_thought: RandomWalkThought, flags: dict = None, sayback: str = None):
        return FindFoodThought(random_walk_thought=random_walk_thought, flags=flags, sayback=sayback)
    
    def build_collect_food_thought(self, nest: Nest, random_walk_thought: RandomWalkThought, go_gome_thought: GoInNestThought, found_food: Item = None, flags: dict = None, sayback: str = None):
        return CollectFoodThought(nest=nest, random_walk_thought=random_walk_thought, go_home_thought=go_gome_thought, found_food=found_food, flags=flags, sayback=sayback)
    
    def build_feed_myself_thought(self, home: Nest, find_food_thought: FindFoodThought, go_home_thought: GoInNestThought, found_food: Item = None, flags: dict = None, sayback: str = None):
        return FeedMyselfThought(home=home, find_food_thought=find_food_thought, go_home_thought=go_home_thought, found_food=found_food, flags=flags, sayback=sayback)

    def build_prepare_for_operation_thought(self, feed_myself_thought: FeedMyselfThought, assemble_point: Point, flags: dict = None, sayback: str = None):
        return PrepareForOperationThought(feed_myself_thought=feed_myself_thought, assemble_point=assemble_point, flags=flags, sayback=sayback)
    
    def build_build_nest_thought(self, building_nest: Nest, get_inside_once_done: bool, flags: dict = None, sayback: str = None):
        return BuildNestThought(building_nest=building_nest, get_inside_once_done=get_inside_once_done, flags=flags, sayback=sayback)
    
    # def build_defend_teritory(self, fight_near_enemies_thought: FightNearEnemiesThought, random_walk_thought: RandomWalkThought, defending_nest: Nest, point_to_check: Point = None, flags: dict = None, sayback: str = None):
    #     return DefendTerritoryThought(fight_near_enemies_thought=fight_near_enemies_thought, random_walk_thought=random_walk_thought, defending_nest=defending_nest, point_to_check=point_to_check, flags=flags, sayback=sayback)
    
    def build_attack_nest_thought(self, fight_near_enemies_thought: FightNearEnemiesThought, nest: Nest, flags: dict = None, sayback: str = None):
        return AttackNestThought(fight_near_enemies_thought=fight_near_enemies_thought, nest=nest, flags=flags, sayback=sayback)
    
    def build_fight_enemy_thought(self, enemy: iEnemy, flags: dict = None, sayback: str = None):
        return FightEnemyThought(enemy=enemy, flags=flags, sayback=sayback)
    
    def build_fight_near_enemies_thought(self, fight_enemy_thought: FightEnemyThought, flags: dict = None, sayback: str = None):
        return FightNearEnemiesThought(fight_enemy_thought=fight_enemy_thought, flags=flags, sayback=sayback)
    
    def build_defend_nest_thought(self, fight_near_enemies_thought: FightNearEnemiesThought, defending_nest: Nest, point_to_check: Point, flags: dict = None, sayback: str = None):
        return DefendNestThought(fight_near_enemies_thought=fight_near_enemies_thought, defending_nest=defending_nest, point_to_check=point_to_check, flags=flags, sayback=sayback)
    
    def build_random_walk_thought(self, center: Point, radius: int, flags: dict = None, sayback: str = None):
        return RandomWalkThought(center=center, radius=radius, flags=flags, sayback=sayback)
    
    def build_hunt_for_aphid(self, random_walk_thought: RandomWalkThought, fight_near_enemies_thought: FightNearEnemiesThought, found_food_source: ItemSource, flags: dict = None, sayback: str = None):
        return HuntForAphid(random_walk_thought=random_walk_thought, fight_near_enemies_thought=fight_near_enemies_thought, found_food_source=found_food_source, flags=flags, sayback=sayback)
    
    def build_keep_clear_territory(self, fight_near_enemies_thought: FightNearEnemiesThought, random_walk_thought: RandomWalkThought, flags: dict = None, sayback: str = None):
        return KeepClearTerritoryThought( fight_near_enemies_thought=fight_near_enemies_thought, random_walk_thought=random_walk_thought, flags=flags, sayback=sayback)
    
    def build_wait_step(self, step_count: int, flags: dict = None, sayback: str = None):
        return WaitStepThought(step_count=step_count, flags=flags, sayback=sayback)
    
    def build_patrol_nest_territory(self, random_walk_thought: RandomWalkThought, nest: Nest, step_count: int, flags: dict = None, sayback: str = None) -> PatrolNestTerritoryThought:
        return PatrolNestTerritoryThought(random_walk_thought, nest, step_count, flags, sayback)
    
    def build_hibernation(self, go_gome_thought: GoInNestThought, flags: dict = None, sayback: str = None):
        return HibernationThought(go_gome_thought, flags, sayback)
    
    def build_shelter_in_nest(self, go_gome_thought: GoInNestThought, shelter_nest: Nest, flags: dict = None, sayback: str = None):
        return ShelterInNestThought(go_gome_thought, shelter_nest, flags, sayback)
    
    def build_build_fortification(self, random_walk_thought: RandomWalkThought, nest: Nest, flags: dict = None, sayback: str = None):
        return BuildFortificationThought(random_walk_thought, nest, flags, sayback)
    
    def build_defend_colony(self, fight_near_enemies_thought: FightNearEnemiesThought, point_to_check: Point = None, flags: dict = None, sayback: str = None):
        return DefendColonyThought(fight_near_enemies_thought, point_to_check, flags, sayback)
    
    def build_defend_myself(self, fight_near_enemies_thought: FightNearEnemiesThought, flags: dict = None, sayback: str = None):
        return DefendMyselfThought(fight_near_enemies_thought, flags, sayback)
    
    def build_ladybug_hibernation_thought(self, random_walk_thought: RandomWalkThought, fight_near_enemies_thought: FightNearEnemiesThought, found_tree: Tree, flags: dict = None, sayback: str = None):
        return LadybugHibernationThought(random_walk_thought, fight_near_enemies_thought, found_tree, flags, sayback)

    def build_feed_myself_new(self, home_nest: Nest, sayback: str = None):
        random_walk_thought = self.build_random_walk_thought(home_nest.position, home_nest.area)
        find_food_thought = self.build_find_food_thought(random_walk_thought)
        go_home_thought = self.build_go_in_nest_thought( home_nest)
        return self.build_feed_myself_thought(home=home_nest, find_food_thought=find_food_thought, go_home_thought=go_home_thought, sayback=sayback)
    
    def build_collect_food_new(self, home_nest: Nest, sayback: str = None):
        random_walk_thought = self.build_random_walk_thought(home_nest.position, home_nest.area)
        go_home_thought = self.build_go_in_nest_thought( home_nest)
        return self.build_collect_food_thought(home_nest, random_walk_thought, go_home_thought, sayback=sayback)
    
    def build_prepare_for_operation_new(self, home_nest: Nest, assemble_point: Point, sayback: str = None):
        feed_myself_thought = self.build_feed_myself_new(home_nest=home_nest)
        return self.build_prepare_for_operation_thought(feed_myself_thought=feed_myself_thought, assemble_point=assemble_point, sayback=sayback)
    
    def build_attack_nest_thought_new(self, nest: Nest, sayback: str = None):
        fight_near_enemies_thought = self.build_fight_near_enemies_thought_new()
        return self.build_attack_nest_thought(fight_near_enemies_thought=fight_near_enemies_thought, nest=nest, sayback=sayback)
    
    def build_defend_nest_thought_new(self, nest: Nest, point_to_check: Point, sayback: str = None):
        fight_near_enemies_thought = self.build_fight_near_enemies_thought_new()
        return self.build_defend_nest_thought(fight_near_enemies_thought=fight_near_enemies_thought, defending_nest=nest, point_to_check=point_to_check, sayback=sayback)

    def build_fight_near_enemies_thought_new(self):
        fight_enemy_thought = self.build_fight_enemy_thought(None)
        return self.build_fight_near_enemies_thought(fight_enemy_thought=fight_enemy_thought)

    def build_hunt_for_aphid_thought_new(self, sayback: str = None):
        random_walk_thought = self.build_random_walk_thought(None, None)
        fight_near_enemies_thought = self.build_fight_near_enemies_thought_new()
        return self.build_hunt_for_aphid(random_walk_thought=random_walk_thought, fight_near_enemies_thought=fight_near_enemies_thought, found_food_source=None, sayback=sayback)
    
    def build_keep_clear_territory_new(self, position: Point, area: int, sayback: str = None):
        random_walk_thought = self.build_random_walk_thought(position, area)
        fight_near_enemies_thought = self.build_fight_near_enemies_thought_new()
        return self.build_keep_clear_territory(fight_near_enemies_thought=fight_near_enemies_thought, random_walk_thought=random_walk_thought, sayback=sayback)
    
    def build_patrol_nest_territory_new(self, nest: Nest, step_count: int = 0, flags: dict = None, sayback: str = None) -> PatrolNestTerritoryThought:
        random_walk_thought = self.build_random_walk_thought(nest.position, nest.area)
        return self.build_patrol_nest_territory(random_walk_thought, nest, step_count, flags, sayback)
    
    def build_hibernation_new(self, home: Nest, flags: dict = None, sayback: str = None) -> HibernationThought:
        go_home_thought = self.build_go_in_nest_thought(home)
        return HibernationThought(go_home_thought, flags, sayback)
    
    def build_shelter_in_nest_new(self, shelter_nest: Nest, flags: dict = None, sayback: str = None) -> ShelterInNestThought:
        go_home_thought = self.build_go_in_nest_thought(shelter_nest)
        return self.build_shelter_in_nest(go_home_thought, shelter_nest, flags, sayback)
    
    def build_build_fortification_new(self, nest: Nest, flags: dict = None, sayback: str = None) -> BuildFortificationThought:
        random_walk_thought = self.build_random_walk_thought(nest.position, nest.area)
        return self.build_build_fortification(random_walk_thought, nest, flags, sayback)
    
    def build_defend_colony_new(self, point_to_check: Point, sayback: str = None) -> DefendColonyThought:
        fight_near_enemies_thought = self.build_fight_near_enemies_thought_new()
        return self.build_defend_colony(fight_near_enemies_thought, point_to_check, sayback=sayback)
    
    def build_defend_myself_new(self, sayback: str = None) -> DefendMyselfThought:
        fight_near_enemies_thought = self.build_fight_near_enemies_thought_new()
        return self.build_defend_myself(fight_near_enemies_thought, sayback=sayback)
    
    def build_ladybug_hibernation_thought_new(self, found_tree: Tree = None, flags: Dict = None, sayback: str = None):
        random_walk_thought = self.build_random_walk_thought(None, None)
        fight_near_enemies_thought = self.build_fight_near_enemies_thought_new()
        return self.build_ladybug_hibernation_thought(random_walk_thought, fight_near_enemies_thought, found_tree, flags, sayback)
