from core.world.entities.ant.base.ant_task_factory import AntTaskFactory
from core.world.entities.nest.nest import Nest
from .tasks.build_nest_task import BuildNestTask

class QueenTaskFactory(AntTaskFactory):

    def build_build_new_nest_task(self, new_nest: Nest):
        return BuildNestTask(self._body, new_nest)
