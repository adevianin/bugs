from ..warrior_ant_body import WarriorAntBody
from core.world.entities.task.task import Task
from core.world.entities.ant.base.tasks.searching_walk_task import SearchingWalkTask

class PatrollingTerritoryTask(Task):

    def __init__(self, body: WarriorAntBody, search_walk_task: SearchingWalkTask):
        super().__init__(body)
        self._searching_walk_task = search_walk_task

    def do_step(self):
        print('patroling')
        self._searching_walk_task.do_step()