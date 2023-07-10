from core.world.entities.thought.thought import Thought
from core.world.utils.point import Point

class WalkToThought(Thought):

    def __init__(self, position: Point, flags: dict = None, sayback: str = None):
        super().__init__('walk_to', flags, sayback)
        self._position = position

    def do_step(self):
        is_done = self._body.step_to(self._position)
        if is_done:
            self.mark_as_done()

    def to_full_json(self):
        json = super().to_full_json()
        json.update({
            'position': self._position
        })
        return json
    