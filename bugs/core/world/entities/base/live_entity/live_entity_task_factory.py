from core.world.entities.task.task_factory import TaskFactory
from .tasks.go_in_town import GoInTownTask
from core.world.entities.town.town import Town
from core.world.utils.point import Point
from .tasks.walk_to_task import WalkToTask

class LiveEntityTaskFactory(TaskFactory):

    def build_go_in_town_task(self, town: Town):
        return GoInTownTask(self._body, town)
    
    def build_walk_to_task(self, position: Point):
        return WalkToTask(self._body, position)

