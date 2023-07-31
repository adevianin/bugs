from core.world.entities.thought.thought import Thought
from core.world.entities.base.entity_types import EntityTypes
from .searching_walk_thought import SearchingWalkThought
from core.world.entities.base.live_entity.memory import Memory
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.ant.base.ant_body import AntBody

import math

class FindFoodThought(Thought):

    _body: AntBody

    def __init__(self, random_walk_thought: SearchingWalkThought, flags: dict = None, sayback: str = None):
        super().__init__(ThoughtTypes.FIND_FOOD, flags, sayback)
        self._nested_thoughts['random_walk_thought'] = random_walk_thought

        self._points_to_check = []

    @property
    def searching_walk_thought(self) -> SearchingWalkThought:
        return self._nested_thoughts['random_walk_thought']

    def do_step(self):
        found_food = self._look_around_for_food()
        if (found_food):
            return False
        
        if (not self._read_flag('memory_read')):
            self._points_to_check = self._get_points_to_check()
            self._write_flag('memory_read', True)

        if (not self._read_flag('points_checked')):
            if (len(self._points_to_check) > 0):
                checking_point = self._points_to_check[0]
                got_to_point = self._body.step_to_near(checking_point)
                if (got_to_point):
                    self._points_to_check.pop(0)
                    self._look_around_for_food()
                return True
            else:
                self._write_flag('points_checked', True)
        if (self._read_flag('points_checked')):
            is_doing_action = self.searching_walk_thought.do_step()
            self._look_around_for_food()
            return is_doing_action

    def _get_points_to_check(self):
        entities_data = self._memory.get_entities_data([EntityTypes.FOOD, EntityTypes.FOOD_AREA])
        positions = []
        for entity_data in entities_data:
            positions.append(entity_data['position'])

        positions.sort(key=lambda position: math.dist([position[0], position[1]], [self._body.position.x, self._body.position.y]))

        return positions

    def _look_around_for_food(self):
        foods = self._body.look_around_for_food()

        if (len(foods) > 0):
            self.done(foods[0])
            return True
        else:
            return False
