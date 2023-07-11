from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.base.live_entity.thoughts.go_in_nest import GoInNestThought
from core.world.entities.base.live_entity.thoughts.walk_to_thought import WalkToThought
from core.world.entities.ant.base.thoughts.searching_walk_thought import SearchingWalkThought
from core.world.entities.ant.base.thoughts.find_food_thought import FindFoodThought
from core.world.entities.ant.base.thoughts.collect_food_thought import CollectFoodThought
from core.world.entities.ant.base.thoughts.feed_myself_thought import FeedMyselfThought
from core.world.entities.ant.base.thoughts.prepare_for_opertation_thought import PrepareForOperationThought

class ThoughtSerializer():

    def serialize(self, thought: Thought):
        match(thought.type):
            case ThoughtTypes.GO_IN_NEST:
                return self._serialize_go_in_nest(thought)
            case ThoughtTypes.WALK_TO:
                return self._serialize_walk_to(thought)
            case ThoughtTypes.SEARCHING_WALK:
                return self._serialize_searching_walk(thought)
            case ThoughtTypes.FIND_FOOD:
                return self._serialize_find_food(thought)
            case ThoughtTypes.COLLECT_FOOD:
                return self._serialize_collect_food(thought)
            case ThoughtTypes.FEED_MYSELF:
                return self._serialize_feed_myself(thought)
            case ThoughtTypes.PREPARE_FOR_OPERATION:
                return self._serialize_prepare_for_operation(thought)

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
    
    def _serialize_searching_walk(self, thought: SearchingWalkThought):
        json = self._serialize_thought(thought)
        json.update({
            'search_near_point': thought.searching_near_point,
            'search_radius': thought.searching_radius
        })

        return json
    
    def _serialize_find_food(self, thought: FindFoodThought):
        json = self._serialize_thought(thought)
        searching_walk_thought_json = self.serialize(thought.searching_walk_thought)
        json.update({
            'searching_walk': searching_walk_thought_json
        })

        return json
    
    def _serialize_collect_food(self, thought: CollectFoodThought):
        json = self._serialize_thought(thought)
        find_food_thought_json = self.serialize(thought.find_food_thought)
        go_home_thought_json = self.serialize(thought.go_home_thought)
        json.update({
            'find_food_thought': find_food_thought_json,
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

