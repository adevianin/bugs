from ..ant_body import AntBody
from core.world.entities.thought.thought import Thought
from .feed_myself_thought import FeedMyselfThought
from core.world.utils.point import Point

class PrepareForOperationThought(Thought):

    def __init__(self, body: AntBody, feed_myself_thought: FeedMyselfThought, assemble_point: Point):
        super().__init__(body)
        self._feed_myself_thought = feed_myself_thought
        self._assemble_point = assemble_point

        self._is_ate_well = False
        self._is_at_assemble_point = False

    def do_step(self):
        if not self._is_ate_well:
            self._feed_myself_thought.do_step()
            if self._feed_myself_thought.is_done():
                self._is_ate_well = True
                return

        if self._is_ate_well and not self._is_at_assemble_point:
            self._is_at_assemble_point = self._body.step_to(self._assemble_point)

        if self._is_at_assemble_point:
            self.mark_as_done()




