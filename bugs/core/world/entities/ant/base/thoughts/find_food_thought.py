from core.world.entities.thought.thought import Thought
from core.world.entities.base.entity_types import EntityTypes
from .searching_walk_thought import SearchingWalkThought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.ant.base.ant_body import AntBody

import math

class FindFoodThought(Thought):

    _body: AntBody

    def __init__(self, body: AntBody, random_walk_thought: SearchingWalkThought, flags: dict = None, sayback: str = None):
        super().__init__(body=body, type=ThoughtTypes.FIND_FOOD, flags=flags, sayback=sayback)
        self._nested_thoughts['random_walk_thought'] = random_walk_thought

    @property
    def searching_walk_thought(self) -> SearchingWalkThought:
        return self._nested_thoughts['random_walk_thought']

    def do_step(self):
        foods = self._body.look_around_for_food()
        if len(foods) > 0:
            self.done(foods[0])
            return False
        
        self.searching_walk_thought.do_step()
        
        return True
    