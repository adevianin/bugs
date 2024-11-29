from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.base.live_entity.thoughts.go_in_nest import GoInNestThought

class HibernationThought(Thought):

    class Flags(Thought.Flags):
        ATE_WELL = 'ate_well'

    _body: AntBody

    def __init__(self, go_home_thought: GoInNestThought, flags: dict, sayback: str):
        super().__init__(ThoughtTypes.HIBERNATION, flags, sayback)
        self._nested_thoughts['go_home_thought'] = go_home_thought
        self._nest = self.go_home_thought.nest

        self._nest_removal_block_id = self._nest.block_removal()

    @property
    def go_home_thought(self) -> GoInNestThought:
        return self._nested_thoughts['go_home_thought']
    
    def _on_stop_thinking(self):
        super()._on_stop_thinking()
        self._nest.unblock_removal(self._nest_removal_block_id)

    def do_step(self) -> bool:
        if self.go_home_thought.is_done:
            if not self._read_flag(self.Flags.ATE_WELL):
                self._body.eat_from_nest(self._nest)
                self._write_flag(self.Flags.ATE_WELL, True)
                return
            
            if not self._body.am_i_in_hibernation():
                self._body.enter_hibernation()
                self.done()
        elif self.go_home_thought.is_canceled:
            self.cancel()
        else:
            self.go_home_thought.do_step()
        