from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.thought.thought import Thought
from core.world.entities.nest.nest import Nest
from core.world.entities.base.live_entity.thoughts.go_in_nest import GoInNestThought
from core.world.entities.thought.thought_types import ThoughtTypes

class FeedMyselfThought(Thought):

    _body: AntBody
    FOOD_CHECK_DELAY: 50

    def __init__(self, home: Nest, go_home_thought: GoInNestThought, flags: dict = None, sayback: str = None):
        super().__init__(type=ThoughtTypes.FEED_MYSELF, flags=flags, sayback=sayback)
        self._home = home
        self._nested_thoughts['go_home_thought'] = go_home_thought

        self._nest_removal_block_id = self._home.block_removal()

    @property
    def home_id(self):
        return self._home.id
    
    @property
    def go_home_thought(self) -> GoInNestThought:
        return self._nested_thoughts['go_home_thought']

    def can_be_delayed(self):
        return False
    
    def _on_stop_thinking(self):
        super()._on_stop_thinking()
        self._home.unblock_removal(self._nest_removal_block_id)

    def do_step(self):
        if self.go_home_thought.is_done:
            self._body.eat_from_nest(self._home)
            self._body.get_out_of_nest()
            if (self._body.check_am_i_hungry()):
                self._body.memory.save_flag(self._body.MemoryKeys.NO_MORE_FOOD_AT_HOME, True, self.FOOD_CHECK_DELAY)
            self.done()
        elif self.go_home_thought.is_canceled:
            self.cancel()
        else:
            self.go_home_thought.do_step()
        