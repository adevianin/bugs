from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.thought.thought import Thought
from core.world.entities.base.live_entity.thoughts.go_in_nest import GoInNestThought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.ant.base.ant_activity_types import AntActivityTypes

class GoHomeThought(Thought):

    _body: AntBody

    def __init__(self, go_in_nest_thought: GoInNestThought, flags: dict = None, sayback: str = None):
        super().__init__(type=ThoughtTypes.GO_HOME, flags=flags, sayback=sayback)
        self._nested_thoughts['go_in_nest_thought'] = go_in_nest_thought

    @property
    def go_in_nest_thought(self) -> GoInNestThought:
        return self._nested_thoughts['go_in_nest_thought']

    def do_step(self):
        self._body.set_current_activity(AntActivityTypes.GO_HOME)
        
        if self.go_in_nest_thought.is_done:
            self.done()
        elif self.go_in_nest_thought.is_canceled:
            self.cancel()
        else:
            self.go_in_nest_thought.do_step()
        