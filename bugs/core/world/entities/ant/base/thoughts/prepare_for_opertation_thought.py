from core.world.entities.thought.thought import Thought
from .feed_myself_thought import FeedMyselfThought
from core.world.utils.point import Point
from core.world.entities.base.live_entity.body import Body
from core.world.entities.base.live_entity.memory import Memory
from core.world.entities.base.live_entity.world_interactor import WorldInteractor
from core.world.entities.thought.thought_types import ThoughtTypes

class PrepareForOperationThought(Thought):

    def __init__(self, feed_myself_thought: FeedMyselfThought, assemble_point: Point, flags: dict = None, sayback: str = None):
        super().__init__(ThoughtTypes.PREPARE_FOR_OPERATION, flags, sayback)
        self._feed_myself_thought = feed_myself_thought
        self._assemble_point = assemble_point

    @property
    def feed_myself_thought(self):
        return self._feed_myself_thought
    
    @property
    def assemble_point(self):
        return self._assemble_point

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

    def set_mind_parts(self, body: Body, memory: Memory):
        super().set_mind_parts(body, memory)
        self._feed_myself_thought.set_mind_parts(body, memory)
    
    def _reset_flags(self):
        self._flags = {
            'is_ate_well': False,
            'is_at_assemble_point': False
        }




