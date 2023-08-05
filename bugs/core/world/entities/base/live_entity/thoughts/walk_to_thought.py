from core.world.entities.base.live_entity.body import Body
from core.world.entities.thought.thought import Thought
from core.world.utils.point import Point
from core.world.entities.thought.thought_types import ThoughtTypes

class WalkToThought(Thought):

    def __init__(self, body: Body, position: Point, flags: dict = None, sayback: str = None):
        super().__init__(body=body, type=ThoughtTypes.WALK_TO, flags=flags, sayback=sayback)
        self._position = position

    @property
    def position(self):
        return self._position

    def do_step(self):
        is_done = self._body.step_to(self._position)
        if is_done:
            self.done()
    