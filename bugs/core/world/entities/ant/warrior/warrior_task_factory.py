from core.world.entities.ant.base.ant_task_factory import AntTaskFactory
from .tasks.patrolling_territory_task import PatrollingTerritoryTask
from core.world.entities.nest.nest import Nest

class WarriorTaskFactory(AntTaskFactory):

    def build_patrolling_nest_territory_task(self, nest: Nest):
        searching_task = self.build_searching_walk_task(nest.position, nest.area)
        return PatrollingTerritoryTask(self._body, searching_task)
