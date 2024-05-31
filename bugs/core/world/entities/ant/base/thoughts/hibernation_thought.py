from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.nest.nest import Nest
from core.world.entities.base.live_entity.thoughts.go_in_nest import GoInNestThought

class HibernationThought(Thought):

    def __init__(self, body: AntBody, go_home_thought: GoInNestThought, flags: dict, sayback: str):
        super().__init__(body, ThoughtTypes.HIBERNATION, flags, sayback)
        self._nested_thoughts['go_home_thought'] = go_home_thought

    @property
    def go_home_thought(self) -> GoInNestThought:
        return self._nested_thoughts['go_home_thought']

    def do_step(self) -> bool:
        if not self.go_home_thought.is_done:
            self.go_home_thought.do_step()
            return
        
        self.done()
        

