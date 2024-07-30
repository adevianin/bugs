from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.base.live_entity.thoughts.go_in_nest import GoInNestThought
from core.world.entities.nest.nest import Nest

class ShelterInNestThought(Thought):

    _body: AntBody

    def __init__(self, body: AntBody, go_home_thought: GoInNestThought, shelter_nest: Nest, flags: dict, sayback: str):
        super().__init__(body, ThoughtTypes.SHELTER_IN_NEST, flags, sayback)
        self._nested_thoughts['go_home_thought'] = go_home_thought
        self._shelter_nest = shelter_nest

        self._body.events.add_listener('colony_signal:no_enemies', self._on_no_enemies_signal)

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
        
    def _on_no_enemies_signal(self, signal: dict):
        nest: Nest = signal['nest']
        if nest.id == self._shelter_nest.id:
            print('done sheltering', self._body)
            self.done()

    def _on_stop_thinking(self):
        super()._on_stop_thinking()

        self._body.events.remove_listener('colony_signal:no_enemies', self._on_no_enemies_signal)
        
        
