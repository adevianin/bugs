from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.base.live_entity.thoughts.random_walk_thought import RandomWalkThought

class FindFoodThought(Thought):

    _body: AntBody

    def __init__(self, body: AntBody, random_walk_thought: RandomWalkThought, flags: dict = None, sayback: str = None):
        super().__init__(body=body, type=ThoughtTypes.FIND_FOOD, flags=flags, sayback=sayback)
        self._nested_thoughts['random_walk_thought'] = random_walk_thought

    @property
    def random_walk_thought(self) -> RandomWalkThought:
        return self._nested_thoughts['random_walk_thought']

    def do_step(self):
        foods = self._body.look_around_for_food()
        if len(foods) > 0:
            self.done(foods[0])
            return False
        
        self.random_walk_thought.do_step()
        
        return True
    