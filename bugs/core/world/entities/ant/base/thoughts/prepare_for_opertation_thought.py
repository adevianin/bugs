from core.world.entities.base.live_entity.live_body import LiveBody
from core.world.entities.thought.thought import Thought
from .feed_myself_thought import FeedMyselfThought
from core.world.utils.point import Point
from core.world.entities.thought.thought_types import ThoughtTypes

class PrepareForOperationThought(Thought):

    def __init__(self, feed_myself_thought: FeedMyselfThought, assemble_point: Point, flags: dict = None, sayback: str = None):
        super().__init__(type=ThoughtTypes.PREPARE_FOR_OPERATION, flags=flags, sayback=sayback)
        self._nested_thoughts['feed_myself_thought'] = feed_myself_thought
        self._assemble_point = assemble_point

    @property
    def feed_myself_thought(self) -> FeedMyselfThought:
        return self._nested_thoughts['feed_myself_thought']
    
    @property
    def assemble_point(self):
        return self._assemble_point

    def do_step(self):
        if not self._read_flag('is_ate_well'):
            self.feed_myself_thought.do_step()
            if self.feed_myself_thought.is_done:
                self._write_flag('is_ate_well', True)
                return

        if self._read_flag('is_ate_well') and not self._read_flag('is_at_assemble_point'):
            self._write_flag('is_at_assemble_point', self._body.step_to(self._assemble_point))

        if self._read_flag('is_at_assemble_point'):
            self.done()
