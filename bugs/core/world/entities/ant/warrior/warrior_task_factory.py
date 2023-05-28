from core.world.entities.ant.base.ant_task_factory import AntTaskFactory
from .tasks.patrolling_territory_task import PatrollingTerritoryTask
from core.world.entities.ant.base.tasks.searching_walk_task import SearchingWalkTask
from core.world.entities.town.town import Town

class WarriorTaskFactory(AntTaskFactory):

    def build_patrolling_town_territory_task(self, town: Town):
        searching_task = self.build_searching_walk_task(town.position, town.area)
        return PatrollingTerritoryTask(self._body, searching_task)
