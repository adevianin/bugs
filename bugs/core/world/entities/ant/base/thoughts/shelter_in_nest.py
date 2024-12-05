from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.base.live_entity.thoughts.go_in_nest import GoInNestThought
from core.world.entities.nest.nest import Nest
from core.world.entities.ant.base.ant_activity_types import AntActivityTypes

class ShelterInNestThought(Thought):

    _body: AntBody

    def __init__(self, go_home_thought: GoInNestThought, shelter_nest: Nest, flags: dict, sayback: str):
        super().__init__(ThoughtTypes.SHELTER_IN_NEST, flags, sayback)
        self._nested_thoughts['go_home_thought'] = go_home_thought
        self._shelter_nest = shelter_nest

        self._nest_removal_block_id = self._shelter_nest.block_removal()

    @property
    def go_home_thought(self) -> GoInNestThought:
        return self._nested_thoughts['go_home_thought']
    
    @property
    def shelter_nest_id(self):
        return self._shelter_nest.id
    
    def _on_stop_thinking(self):
        super()._on_stop_thinking()
        self._shelter_nest.unblock_removal(self._nest_removal_block_id)

    def do_step(self) -> bool:
        self._body.set_current_activity(AntActivityTypes.SHELTERING_IN_NEST)

        if self._shelter_nest.is_under_attack:
            if self.go_home_thought.is_in_progress:
                self.go_home_thought.do_step()
            elif self.go_home_thought.is_canceled:
                self.cancel()
            elif self.go_home_thought.is_done:
                if self._shelter_nest.is_died:
                    self.cancel()
        else:
            self.done()
