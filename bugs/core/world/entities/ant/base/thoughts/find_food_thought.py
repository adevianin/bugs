from core.world.entities.thought.thought import Thought
from core.world.entities.base.entity_types import EntityTypes
from .searching_walk_thought import SearchingWalkThought
from core.world.entities.base.live_entity.body import Body
from core.world.entities.base.live_entity.memory import Memory
from core.world.entities.base.live_entity.world_interactor import WorldInteractor

import math

class FindFoodThought(Thought):

    def __init__(self, random_walk_thought: SearchingWalkThought, flags: dict = None, sayback: str = None):
        super().__init__('find_food', flags, sayback)
        self._random_walk_thought = random_walk_thought

        self._points_to_check = []

    def do_step(self):
        found_food = self._look_around_for_food()
        if (found_food):
            return
        
        if (not self._flags['memory_read']):
            self._points_to_check = self._get_points_to_check()
            self._flags['memory_read'] = True

        if (not self._flags['points_checked']):
            if (len(self._points_to_check) > 0):
                checking_point = self._points_to_check[0]
                got_to_point = self._body.step_to_near(checking_point)
                if (got_to_point):
                    self._points_to_check.pop(0)
                    self._look_around_for_food()
                return
            else:
                self._flags['points_checked'] = True
        if (self._flags['points_checked']):
            self._random_walk_thought.do_step()
            self._look_around_for_food()

    def restart(self):
        super().restart()
        self._reset_flags()

    def set_mind_parts(self, body: Body, memory: Memory, world_interactor: WorldInteractor):
        super().set_mind_parts(body, memory, world_interactor)
        self._random_walk_thought.set_mind_parts(body, memory, world_interactor)

    def to_full_json(self):
        json = super().to_full_json()
        json.update({
            'searching_walk': self._random_walk_thought.to_full_json()
        })
        return json
    
    def _get_points_to_check(self):
        entities_data = self._memory.get_entities_data([EntityTypes.FOOD, EntityTypes.FOOD_AREA])
        positions = []
        for entity_data in entities_data:
            positions.append(entity_data['position'])

        positions.sort(key=lambda position: math.dist([position[0], position[1]], [self._body.position.x, self._body.position.y]))

        return positions

    def _look_around_for_food(self):
        foods = self._world_interator.get_nearby_entities([EntityTypes.FOOD])

        if (len(foods) > 0):
            self.mark_as_done(foods[0])
            return True
        else:
            return False

    def _reset_flags(self):
        self._flags = {
            'memory_read': False,
            'points_checked': False
        }
        

    
