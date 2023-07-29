from core.world.entities.thought.thought import Thought
from core.world.entities.nest.nest import Nest
from core.world.entities.thought.thought_types import ThoughtTypes

class GoInNestThought(Thought):

    def __init__(self, flags, sayback: str, nest: Nest):
        super().__init__(type=ThoughtTypes.GO_IN_NEST, flags=flags, sayback=sayback)
        self._nest = nest

    @property
    def nest_id(self):
        return self._nest.id

    def do_step(self):
        if self._read_flag('is_near_nest'):
            self._body.get_in_nest(self._nest)
            self.mark_as_done()
        else:
            self._write_flag('is_near_nest', self._body.step_to(self._nest.position))
    