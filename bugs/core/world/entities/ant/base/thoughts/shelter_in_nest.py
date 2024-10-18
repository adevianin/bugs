from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.base.live_entity.thoughts.go_in_nest import GoInNestThought
from core.world.entities.nest.nest import Nest

class ShelterInNestThought(Thought):

    _body: AntBody

    def __init__(self, go_home_thought: GoInNestThought, shelter_nest: Nest, flags: dict, sayback: str):
        super().__init__(ThoughtTypes.SHELTER_IN_NEST, flags, sayback)
        self._nested_thoughts['go_home_thought'] = go_home_thought
        self._shelter_nest = shelter_nest

        self._shelter_nest.events.add_listener('attack_is_over', self._on_attack_is_over)

    @property
    def go_home_thought(self) -> GoInNestThought:
        return self._nested_thoughts['go_home_thought']
    
    @property
    def shelter_nest_id(self):
        return self._shelter_nest.id

    def do_step(self) -> bool:
        if not self.go_home_thought.is_done:
            self.go_home_thought.do_step()
            return  
        
    def _on_attack_is_over(self):
        self.done()

    def _on_stop_thinking(self):
        super()._on_stop_thinking()

        self._shelter_nest.events.remove_listener('attack_is_over', self._on_attack_is_over)
        
        
