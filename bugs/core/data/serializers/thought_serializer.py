from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.base.live_entity.thoughts.go_in_nest import GoInNestThought
from core.world.entities.base.live_entity.thoughts.walk_to_thought import WalkToThought
from core.world.entities.ant.base.thoughts.collect_food_thought import CollectFoodThought
from core.world.entities.ant.base.thoughts.feed_myself_thought import FeedMyselfThought
from core.world.entities.ant.base.thoughts.build_nest_thought import BuildNestThought
from core.world.entities.base.live_entity.thoughts.fight_enemy_thought import FightEnemyThought
from core.world.entities.ant.base.thoughts.attack_nest_thought import AttackNestThought
from core.world.entities.base.live_entity.thoughts.fight_near_enemies_thought import FightNearEnemiesThought
from core.world.entities.ant.base.thoughts.defend_nest_thought import DefendNestThought
from core.world.entities.base.live_entity.thoughts.random_walk_thought import RandomWalkThought
from core.world.entities.ladybug.thoughts.hunt_for_aphid import HuntForAphid
from core.world.entities.ant.warrior.thoughts.patrol_nest_territory_thought import PatrolNestTerritoryThought
from core.world.entities.ant.base.thoughts.hibernation_thought import HibernationThought
from core.world.entities.ant.base.thoughts.shelter_in_nest import ShelterInNestThought
from core.world.entities.ant.base.thoughts.build_fortification_thought import BuildFortificationThought
from core.world.entities.ant.base.thoughts.defend_colony_thought import DefendColonyThought
from core.world.entities.ant.base.thoughts.defend_myself_thought import DefendMyselfThought
from core.world.entities.ant.warrior.thoughts.keep_clear_territory_thought import KeepClearTerritoryThought
from core.world.entities.ladybug.thoughts.ladybug_hibernation_thought import LadybugHibernationThought
from core.world.entities.base.live_entity.thoughts.wait_step_thought import WaitStepThought

class ThoughtSerializer():

    def serialize(self, thought: Thought):
        match(thought.type):
            case ThoughtTypes.GO_IN_NEST:
                return self._serialize_go_in_nest(thought)
            case ThoughtTypes.WALK_TO:
                return self._serialize_walk_to(thought)
            case ThoughtTypes.COLLECT_FOOD:
                return self._serialize_collect_food(thought)
            case ThoughtTypes.FEED_MYSELF:
                return self._serialize_feed_myself(thought)
            case ThoughtTypes.BUILD_NEST:
                return self._serialize_build_nest(thought)
            case ThoughtTypes.ATTACK_NEST:
                return self._serialize_attack_nest(thought)
            case ThoughtTypes.FIGHT_ENEMY:
                return self._serialize_fight_enemy(thought)
            case ThoughtTypes.FIGHT_NEAR_ENEMIES:
                return self._serialize_fight_near_enemies(thought)
            case ThoughtTypes.DEFEND_NEST:
                return self._serialize_defend_nest(thought)
            case ThoughtTypes.RANDOM_WALK:
                return self._serialize_random_walk(thought)
            case ThoughtTypes.HUNT_FOR_APHID:
                return self._serialize_hunt_for_aphid(thought)
            case ThoughtTypes.PATROL_NEST_TERRITORY:
                return self._serialize_patrol_nest_territory(thought)
            case ThoughtTypes.HIBERNATION:
                return self._serialize_hibernation(thought)
            case ThoughtTypes.LADYBUG_HIBERNATION:
                return self._serialize_ladybug_hibernation(thought)
            case ThoughtTypes.SHELTER_IN_NEST:
                return self._serialize_shelter_in_nest(thought)
            # case ThoughtTypes.GET_STAHED_ITEM_BACK:
            #     return self._serialize_get_stashed_item_back(thought)
            case ThoughtTypes.BUILD_FORTIFICATION:
                return self._serialize_build_fortification(thought)
            case ThoughtTypes.DEFEND_COLONY:
                return self._serialize_defend_colony(thought)
            case ThoughtTypes.DEFEND_MYSELF:
                return self._serialize_defend_myself(thought)
            case ThoughtTypes.KEEP_CLEAR_TERRITORY:
                return self._serialize_keep_clear_territory(thought)
            case ThoughtTypes.WAIT_STEP:
                return self._serialize_wait_step(thought)
            case _:
                raise Exception('unknown type of thought')

    def _serialize_thought(self, thought: Thought):
        return {
            'type': thought.type,
            'flags': thought.flags,
            'sayback': thought.sayback
        }

    def _serialize_go_in_nest(self, thought: GoInNestThought):
        json = self._serialize_thought(thought)
        json.update({
            'nest_id': thought.nest_id
        })

        return json
    
    def _serialize_walk_to(self, thought: WalkToThought):
        json = self._serialize_thought(thought)
        json.update({
            'position': thought.position
        })

        return json
    
    def _serialize_collect_food(self, thought: CollectFoodThought):
        json = self._serialize_thought(thought)
        random_walk_thought_json = self.serialize(thought.random_walk_thought)
        go_home_thought_json = self.serialize(thought.go_home_thought)
        json.update({
            'random_walk_thought': random_walk_thought_json,
            'go_home_thought': go_home_thought_json,
            'nest_id': thought.nest_id
        })

        return json
    
    def _serialize_feed_myself(self, thought: FeedMyselfThought):
        json = self._serialize_thought(thought)
        go_home_thought_json = self.serialize(thought.go_home_thought)
        json.update({
            'home_id': thought.home_id,
            'go_home_thought': go_home_thought_json
        })

        return json
    
    def _serialize_build_nest(self, thought: BuildNestThought):
        json = self._serialize_thought(thought)
        json.update({
            'building_nest_id': thought.building_nest_id,
            'get_inside_once_done': thought.get_inside_once_done
        })

        return json
    
    # def _serialize_defend_territory(self, thought: DefendTerritoryThought):
    #     json = self._serialize_thought(thought)
    #     random_walk_thought_json = self.serialize(thought.random_walk_thought)
    #     fight_near_enemies_thought_json = self.serialize(thought.fight_near_enemies_thought)
    #     json.update({
    #         'random_walk_thought': random_walk_thought_json,
    #         'fight_near_enemies_thought': fight_near_enemies_thought_json,
    #         'defending_nest_id': thought.defending_nest_id,
    #         'point_to_check': thought.point_to_check
    #     })

    #     return json
    
    def _serialize_attack_nest(self, thought: AttackNestThought):
        json = self._serialize_thought(thought)
        fight_near_enemies_thought_json = self.serialize(thought.fight_near_enemies_thought)
        json.update({
            'nest_id': thought.nest_id,
            'fight_near_enemies_thought': fight_near_enemies_thought_json
        })

        return json
    
    def _serialize_fight_near_enemies(self, thought: FightNearEnemiesThought):
        json = self._serialize_thought(thought)
        fight_enemy_thought_json = self.serialize(thought.fight_enemy_thought)
        json.update({
            'fight_enemy_thought': fight_enemy_thought_json
        })

        return json
    
    def _serialize_fight_enemy(self, thought: FightEnemyThought):
        json = self._serialize_thought(thought)
        json.update({
            'enemy_id': thought.enemy_id
        })

        return json
    
    def _serialize_defend_nest(self, thought: DefendNestThought):
        json = self._serialize_thought(thought)
        fight_near_enemies_thought_json = self.serialize(thought.fight_near_enemies_thought)
        json.update({
            'fight_near_enemies_thought': fight_near_enemies_thought_json,
            'defending_nest_id': thought.defending_nest_id
        })

        return json
    
    def _serialize_random_walk(self, thought: RandomWalkThought):
        json = self._serialize_thought(thought)

        json.update({
            'center': thought.center,
            'radius': thought.radius
        })

        return json
    
    def _serialize_hunt_for_aphid(self, thought: HuntForAphid):
        json = self._serialize_thought(thought)
        random_walk_thought_json = self.serialize(thought.random_walk_thought)
        fight_near_enemies_thought_json = self.serialize(thought.fight_near_enemies_thought)
        json.update({
            'random_walk_thought': random_walk_thought_json,
            'fight_near_enemies_thought': fight_near_enemies_thought_json,
            'found_food_source_id': thought.found_food_source_id
        })

        return json
    
    def _serialize_patrol_nest_territory(self, thought: PatrolNestTerritoryThought):
        json = self._serialize_thought(thought)
        random_walk_thought_json = self.serialize(thought.random_walk_thought)
        json.update({
            'step_count': thought.step_count,
            'nest_id': thought.nest_id,
            'random_walk_thought': random_walk_thought_json
        })

        return json
    
    def _serialize_hibernation(self, thought: HibernationThought):
        json = self._serialize_thought(thought)
        go_home_thought_json = self.serialize(thought.go_home_thought)
        json.update({
            'go_home_thought': go_home_thought_json
        })

        return json
    
    def _serialize_ladybug_hibernation(self, thought: LadybugHibernationThought):
        json = self._serialize_thought(thought)

        random_walk_thought_json = self.serialize(thought.random_walk_thought)
        fight_near_enemies_thought_json = self.serialize(thought.fight_near_enemies_thought)
        
        json.update({
            'found_tree_id': thought.found_tree_id,
            'random_walk_thought': random_walk_thought_json,
            'fight_near_enemies_thought': fight_near_enemies_thought_json
        })

        return json
    
    def _serialize_shelter_in_nest(self, thought: ShelterInNestThought):
        json = self._serialize_thought(thought)
        go_home_thought_json = self.serialize(thought.go_home_thought)
        json.update({
            'go_home_thought': go_home_thought_json,
            'shelter_nest_id': thought.shelter_nest_id
        })

        return json
    
    def _serialize_build_fortification(self, thought: BuildFortificationThought):
        json = self._serialize_thought(thought)

        random_walk_thought_json = self.serialize(thought.random_walk_thought)
        json.update({
            'nest_id': thought.nest_id,
            'random_walk_thought': random_walk_thought_json
        })

        return json
    
    def _serialize_defend_colony(self, thought: DefendColonyThought):
        json = self._serialize_thought(thought)

        fight_near_enemies_thought_json = self.serialize(thought.fight_near_enemies_thought)
        json.update({
            'point_to_check': thought.point_to_check,
            'fight_near_enemies_thought': fight_near_enemies_thought_json
        })

        return json
    
    def _serialize_defend_myself(self, thought: DefendMyselfThought):
        json = self._serialize_thought(thought)

        fight_near_enemies_thought_json = self.serialize(thought.fight_near_enemies_thought)
        json.update({
            'fight_near_enemies_thought': fight_near_enemies_thought_json
        })

        return json
    
    def _serialize_keep_clear_territory(self, thought: KeepClearTerritoryThought):
        json = self._serialize_thought(thought)

        fight_near_enemies_thought_json = self.serialize(thought.fight_near_enemies_thought)
        random_walk_thought_json = self.serialize(thought.random_walk_thought)
        json.update({
            'fight_near_enemies_thought': fight_near_enemies_thought_json,
            'random_walk_thought': random_walk_thought_json
        })

        return json
    
    def _serialize_wait_step(self, thought: WaitStepThought):
        json = self._serialize_thought(thought)

        json.update({
            'step_count': thought.step_count
        })

        return json
