from core.world.entities.thought.thought import Thought
from core.world.entities.nest.nest import Nest
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.ant.base.ant_body import AntBody

class GoInNestThought(Thought):

    _body: AntBody

    def __init__(self, body: AntBody, flags, sayback: str, nest: Nest):
        super().__init__(body=body, type=ThoughtTypes.GO_IN_NEST, flags=flags, sayback=sayback)
        self._nest = nest

    @property
    def nest_id(self):
        return self._nest.id

    def do_step(self):
        if self._body.located_in_nest_id == self._nest.id:
            self.done()
            return

        if self._read_flag('is_near_nest'):
            self._body.get_in_nest(self._nest)
            self.done()
        else:
            is_walk_done = self._body.step_to(self._nest.position)
            self._write_flag('is_near_nest', is_walk_done)
    