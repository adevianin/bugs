from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.base.live_entity.thoughts.go_in_nest import GoInNestThought
from core.world.entities.base.live_entity.thoughts.walk_to_thought import WalkToThought
from core.world.entities.ant.base.thoughts.find_food_thought import FindFoodThought
from core.world.entities.ant.base.thoughts.collect_food_thought import CollectFoodThought
from core.world.entities.ant.base.thoughts.feed_myself_thought import FeedMyselfThought
from core.world.entities.ant.base.thoughts.prepare_for_opertation_thought import PrepareForOperationThought
from core.world.entities.ant.base.thoughts.found_nest_thought import FoundNestThought
from core.world.entities.ant.base.thoughts.build_nest_thought import BuildNestThought
from core.world.entities.ant.warrior.thoughts.defend_territory_thought import DefendTerritoryThought
from core.world.entities.base.live_entity.thoughts.fight_enemy_thought import FightEnemyThought
from core.world.entities.ant.base.thoughts.attack_nest_thought import AttackNestThought
from core.world.entities.base.live_entity.thoughts.fight_near_enemies_thought import FightNearEnemiesThought
from core.world.entities.ant.base.thoughts.reinforce_nest_defence_thought import ReinforceNestDefenceThought
from core.world.entities.base.live_entity.thoughts.random_walk_thought import RandomWalkThought
from core.world.entities.ground_beetle.thoughts.hunt_for_aphid import HuntForAphid
from core.world.entities.ant.base.thoughts.walk_in_formation_thought import WalkInFormationThought


class ThoughtSerializer():

    def serialize(self, thought: Thought):
        match(thought.type):
            case ThoughtTypes.GO_IN_NEST:
                return self._serialize_go_in_nest(thought)
            case ThoughtTypes.WALK_TO:
                return self._serialize_walk_to(thought)
            case ThoughtTypes.FIND_FOOD:
                return self._serialize_find_food(thought)
            case ThoughtTypes.COLLECT_FOOD:
                return self._serialize_collect_food(thought)
            case ThoughtTypes.FEED_MYSELF:
                return self._serialize_feed_myself(thought)
            case ThoughtTypes.PREPARE_FOR_OPERATION:
                return self._serialize_prepare_for_operation(thought)
            case ThoughtTypes.FOUND_NEST:
                return self._serialize_found_nest(thought)
            case ThoughtTypes.BUILD_NEST:
                return self._serialize_build_nest(thought)
            case ThoughtTypes.DEFEND_TERRITORY:
                return self._serialize_defend_territory(thought)
            case ThoughtTypes.ATTACK_NEST:
                return self._serialize_attack_nest(thought)
            case ThoughtTypes.FIGHT_ENEMY:
                return self._serialize_fight_enemy(thought)
            case ThoughtTypes.FIGHT_NEAR_ENEMIES:
                return self._serialize_fight_near_enemies(thought)
            case ThoughtTypes.REINFORCE_NEST_DEFENCE:
                return self._serialize_reinforce_nest_defence(thought)
            case ThoughtTypes.RANDOM_WALK:
                return self._serialize_random_walk(thought)
            case ThoughtTypes.HUNT_FOR_APHID:
                return self._serialize_hunt_for_aphid(thought)
            case ThoughtTypes.WALK_IN_FORMATION:
                return self._serialize_walk_in_formation_thought(thought)
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
    
    def _serialize_find_food(self, thought: FindFoodThought):
        json = self._serialize_thought(thought)
        random_walk_thought_json = self.serialize(thought.random_walk_thought)
        json.update({
            'random_walk_thought': random_walk_thought_json
        })

        return json
    
    def _serialize_collect_food(self, thought: CollectFoodThought):
        json = self._serialize_thought(thought)
        random_walk_thought_json = self.serialize(thought.random_walk_thought)
        go_home_thought_json = self.serialize(thought.go_home_thought)
        json.update({
            'random_walk_thought': random_walk_thought_json,
            'go_home_thought': go_home_thought_json,
            'found_food_id': thought.found_food_id,
            'nest_id': thought.nest_id
        })

        return json
    
    def _serialize_feed_myself(self, thought: FeedMyselfThought):
        json = self._serialize_thought(thought)
        find_food_thought_json = self.serialize(thought.find_food_thought)
        go_home_thought_json = self.serialize(thought.go_home_thought)
        json.update({
            'home_id': thought.home_id,
            'found_food_id': thought.found_food_id,
            'find_food_thought': find_food_thought_json,
            'go_home_thought': go_home_thought_json
        })

        return json
    
    def _serialize_prepare_for_operation(self, thought: PrepareForOperationThought):
        json = self._serialize_thought(thought)
        feed_myself_thought_json = self.serialize(thought.feed_myself_thought)
        json.update({
            'feed_myself_thought': feed_myself_thought_json,
            'assemble_point': thought.assemble_point
        })

        return json
    
    def _serialize_found_nest(self, thought: FoundNestThought):
        json = self._serialize_thought(thought)
        json.update({
            'from_colony_id': thought.from_colony_id,
            'building_site': thought.building_site,
            'found_nest_id': thought.found_nest_id
        })

        return json
    
    def _serialize_build_nest(self, thought: BuildNestThought):
        json = self._serialize_thought(thought)
        json.update({
            'building_nest_id': thought.building_nest_id
        })

        return json
    
    def _serialize_defend_territory(self, thought: DefendTerritoryThought):
        json = self._serialize_thought(thought)
        random_walk_thought_json = self.serialize(thought.random_walk_thought)
        fight_near_enemies_thought_json = self.serialize(thought.fight_near_enemies_thought)
        json.update({
            'random_walk_thought': random_walk_thought_json,
            'fight_near_enemies_thought': fight_near_enemies_thought_json,
            'defending_nest_id': thought.defending_nest_id,
            'point_to_check': thought.point_to_check
        })

        return json
    
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
    
    def _serialize_reinforce_nest_defence(self, thought: ReinforceNestDefenceThought):
        json = self._serialize_thought(thought)
        random_walk_thought_json = self.serialize(thought.random_walk_thought)
        fight_near_enemies_thought_json = self.serialize(thought.fight_near_enemies_thought)
        json.update({
            'random_walk_thought': random_walk_thought_json,
            'fight_near_enemies_thought': fight_near_enemies_thought_json,
            'defending_nest_id': thought.defending_nest_id,
            'point_to_check': thought.point_to_check
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
    
    def _serialize_walk_in_formation_thought(self, thought: WalkInFormationThought):
        json = self._serialize_thought(thought)
        json.update({
        })

        return json

