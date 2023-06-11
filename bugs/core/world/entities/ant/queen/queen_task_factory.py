from core.world.entities.ant.base.ant_task_factory import AntTaskFactory
from core.world.entities.town.town import Town
from .tasks.build_town_task import BuildTownTask

class QueenTaskFactory(AntTaskFactory):

    def build_build_new_town_task(self, new_town: Town):
        return BuildTownTask(self._body, new_town)
