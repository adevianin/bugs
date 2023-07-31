from core.world.entities.thought.thought import Thought
from core.world.utils.point import Point
from core.world.entities.thought.thought_types import ThoughtTypes

class WalkToThought(Thought):

    def __init__(self, position: Point, flags: dict = None, sayback: str = None):
        super().__init__(ThoughtTypes.WALK_TO, flags, sayback)
        self._position = position

    @property
    def position(self):
        return self._position

    def do_step(self):
        is_done = self._body.step_to(self._position)
        if is_done:
            self.done()
    