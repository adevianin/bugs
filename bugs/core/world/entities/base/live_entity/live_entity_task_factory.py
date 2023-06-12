from core.world.entities.task.task_factory import TaskFactory
from .tasks.go_in_nest import GoInNestTask
from core.world.entities.nest.nest import Nest
from core.world.utils.point import Point
from .tasks.walk_to_task import WalkToTask

class LiveEntityTaskFactory(TaskFactory):

    def build_go_in_nest_task(self, nest: Nest):
        return GoInNestTask(self._body, nest)
    
    def build_walk_to_task(self, position: Point):
        return WalkToTask(self._body, position)

