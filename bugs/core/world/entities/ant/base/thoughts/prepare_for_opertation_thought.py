from core.world.entities.thought.thought import Thought
from .feed_myself_thought import FeedMyselfThought
from core.world.utils.point import Point
from core.world.entities.base.live_entity.body import Body
from core.world.entities.base.live_entity.memory import Memory
from core.world.entities.base.live_entity.world_interactor import WorldInteractor

class PrepareForOperationThought(Thought):

    def __init__(self, feed_myself_thought: FeedMyselfThought, assemble_point: Point, flags: dict = None, sayback: str = None):
        super().__init__('prepare_for_operation', flags, sayback)
        self._feed_myself_thought = feed_myself_thought
        self._assemble_point = assemble_point

    def do_step(self):
        if not self._flags['is_ate_well']:
            self._feed_myself_thought.do_step()
            if self._feed_myself_thought.is_done():
                self._flags['is_ate_well'] = True
                return

        if self._flags['is_ate_well'] and not self._flags['is_at_assemble_point']:
            self._flags['is_at_assemble_point'] = self._body.step_to(self._assemble_point)

        if self._flags['is_at_assemble_point']:
            self.mark_as_done()

    def set_mind_parts(self, body: Body, memory: Memory, world_interactor: WorldInteractor):
        super().set_mind_parts(body, memory, world_interactor)
        self._feed_myself_thought.set_mind_parts(body, memory, world_interactor)

    def to_full_json(self):
        json = super().to_full_json()
        json.update({
            'feed_myself_thought': self._feed_myself_thought.to_full_json(),
            'assemble_point': self._assemble_point
        })
        return json
    
    def _reset_flags(self):
        self._flags = {
            'is_ate_well': False,
            'is_at_assemble_point': False
        }




