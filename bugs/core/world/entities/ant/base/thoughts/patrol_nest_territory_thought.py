from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.base.live_entity.thoughts.random_walk_thought import RandomWalkThought
from core.world.entities.nest.nest import Nest
from core.world.entities.ant.base.ant_activity_types import AntActivityTypes

class PatrolNestTerritoryThought(Thought):

    _body: AntBody
    MAX_STEP_COUNT = 10

    def __init__(self, random_walk_thought: RandomWalkThought, nest: Nest, step_count: int, flags: dict = None, sayback: str = None):
        super().__init__(type=ThoughtTypes.PATROL_NEST_TERRITORY, flags=flags, sayback=sayback)
        self._nested_thoughts['random_walk_thought'] = random_walk_thought
        self._nest = nest
        self._step_count = step_count

        self._nest_removal_block_id = self._nest.block_removal()

    @property
    def random_walk_thought(self) -> RandomWalkThought:
        return self._nested_thoughts['random_walk_thought']
    
    @property
    def nest_id(self):
        return self._nest.id
    
    @property
    def step_count(self):
        return self._step_count
    
    def _on_stop_thinking(self):
        super()._on_stop_thinking()
        self._nest.unblock_removal(self._nest_removal_block_id)
    
    def do_step(self):
        self._body.set_current_activity(AntActivityTypes.PATROLING_NEST_TERRITORY)

        if self._nest.is_died:
            self.cancel()
            return
        
        self.random_walk_thought.do_step()
        self._step_count += 1

        if self._step_count >= self.MAX_STEP_COUNT:
            self.done()
        
