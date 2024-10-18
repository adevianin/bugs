from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.base.live_entity.thoughts.go_in_nest import GoInNestThought

class HibernationThought(Thought):

    _body: AntBody

    def __init__(self, go_home_thought: GoInNestThought, flags: dict, sayback: str):
        super().__init__(ThoughtTypes.HIBERNATION, flags, sayback)
        self._nested_thoughts['go_home_thought'] = go_home_thought

    @property
    def go_home_thought(self) -> GoInNestThought:
        return self._nested_thoughts['go_home_thought']

    def do_step(self) -> bool:
        if not self.go_home_thought.is_done:
            self.go_home_thought.do_step()
            return  
        
        if self.go_home_thought.is_done and not self._read_flag('ate_well'):
            self._body.eat_from_nest(self._body.located_in_nest)
            self._write_flag('ate_well', True)
            return
        
        if self._read_flag('ate_well') and not self._body.am_i_in_hibernation():
            self._body.enter_hibernation()
            return
        
        if self._body.am_i_in_hibernation() and self._body.check_urge_to_exit_hibernation():
            self._body.exit_hibernation()
            self.done()
