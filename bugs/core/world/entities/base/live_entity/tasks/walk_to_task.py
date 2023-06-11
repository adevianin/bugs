from core.world.entities.task.task import Task
from ..body import Body
from core.world.utils.point import Point

class WalkToTask(Task):

    def __init__(self, body: Body, position: Point):
        super().__init__(body)
        self._position = position

    def do_step(self):
        is_done = self._body.step_to(self._position)
        if is_done:
            self.mark_as_done()
    