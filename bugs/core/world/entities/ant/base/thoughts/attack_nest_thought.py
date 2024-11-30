from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.nest.nest import Nest
from core.world.entities.ant.base.ant_body import AntBody
from core.world.settings import MAX_NEST_ATTACK_DISTANCE

class AttackNestThought(Thought):

    _body: AntBody

    def __init__(self, nest: Nest, flags: dict, sayback: str):
        super().__init__(type=ThoughtTypes.ATTACK_NEST, flags=flags, sayback=sayback)
        self._nest = nest

        self._nest_removal_block_id = self._nest.block_removal()

    @property
    def nest_id(self):
        return self._nest.id
    
    def _on_stop_thinking(self):
        super()._on_stop_thinking()
        self._nest.unblock_removal(self._nest_removal_block_id)
    
    def do_step(self):
        is_near_nest = self._body.position.dist(self._nest.position) < MAX_NEST_ATTACK_DISTANCE
        if is_near_nest:
            self._body.damage_another_body(self._nest.body)
        else:
            self._body.step_to(self._nest.position)

        if self._nest.is_died:
            self.done()


