from ..ant_body import AntBody
from core.world.entities.thought.thought import Thought
from .feed_myself_thought import FeedMyselfThought
from core.world.utils.point import Point

class PrepareForOperationThought(Thought):

    def __init__(self, body: AntBody, map, feed_myself_thought: FeedMyselfThought, assemble_point: Point, flags: dict = None, sayback: str = None):
        super().__init__(body, map, 'prepare_for_operation', flags, sayback)
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




