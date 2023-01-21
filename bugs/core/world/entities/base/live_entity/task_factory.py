from .walk_task import WalkTask
from .body import Body
from core.world.utils.point import Point

class TaskFactory:

    def __init__(self, body: Body) -> None:
        self._body = body

    def build_walk_task(self, destination_point: Point):
        return WalkTask(self._body, destination_point)
