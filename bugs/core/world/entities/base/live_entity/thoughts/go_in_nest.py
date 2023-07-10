from core.world.entities.thought.thought import Thought
from core.world.entities.nest.nest import Nest

class GoInNestThought(Thought):

    def __init__(self, flags, sayback: str, nest: Nest):
        super().__init__(type='go_in_nest', flags=flags, sayback=sayback)
        self._nest = nest

    def do_step(self):
        if self._flags['is_near_nest']:
            self._body.get_in_nest(self._nest)
            self.mark_as_done()
        else:
            self._flags['is_near_nest'] = self._body.step_to(self._nest.position)

    def restart(self):
        self._reset_flags()
        return super().restart()
    
    def to_full_json(self):
        json = super().to_full_json()
        json.update({
            'nest_id': self._nest.id
        })
        return json
    
    def _reset_flags(self):
        self._flags = {
            'is_near_nest': False
        }