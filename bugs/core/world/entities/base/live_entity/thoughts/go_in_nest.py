from core.world.entities.thought.thought import Thought
from core.world.entities.nest.nest import Nest
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.ant.base.ant_body import AntBody

class GoInNestThought(Thought):

    class Flags(Thought.Flags):
        IS_NEAR_NEST = 'is_near_nest'

    _body: AntBody

    def __init__(self, flags, sayback: str, nest: Nest):
        super().__init__(type=ThoughtTypes.GO_IN_NEST, flags=flags, sayback=sayback)
        self._nest = nest

        self._nest_removal_block_id = self._nest.block_removal()

    @property
    def nest(self) -> Nest:
        return self._nest

    @property
    def nest_id(self):
        return self._nest.id
    
    def _on_stop_thinking(self):
        super()._on_stop_thinking()
        self._nest.unblock_removal(self._nest_removal_block_id)

    def do_step(self):
        if self._body.located_in_nest_id == self._nest.id:
            self.done()
            return

        if self._read_flag(self.Flags.IS_NEAR_NEST):
            if not self._nest.is_died:
                self._body.get_in_nest(self._nest)
                self.done()
            else:
                self.cancel()
        else:
            is_walk_done = self._body.step_to(self._nest.position)
            self._write_flag(self.Flags.IS_NEAR_NEST, is_walk_done)
    