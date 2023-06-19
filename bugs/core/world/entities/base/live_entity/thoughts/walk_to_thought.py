from core.world.entities.thought.thought import Thought
from ..body import Body
from core.world.utils.point import Point

class WalkToThought(Thought):

    def __init__(self, body: Body, position: Point):
        super().__init__(body)
        self._position = position

    def do_step(self):
        is_done = self._body.step_to(self._position)
        if is_done:
            self.mark_as_done()
    