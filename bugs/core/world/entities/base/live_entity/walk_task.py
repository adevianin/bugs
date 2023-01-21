from .task import Task
from .body import Body
from core.world.utils.point import Point

class WalkTask(Task):

    def __init__(self, body: Body, destination_point: Point):
        super().__init__(body)
        self._destination_point = destination_point

    def do_step(self):
        is_on_destination_point = self._body.step_to(self._destination_point)

        if (is_on_destination_point):
            self.mark_as_done()