from core.world.entities.ant.queen.queen_ant import QueenAnt
from core.world.entities.ant.worker.worker_ant import WorkerAnt
from core.world.utils.point import Point
from core.world.entities.task.task_group import TaskGroup
from core.world.entities.town.town import Town

class BuildNewTownOperation():

    @classmethod
    def build_build_new_town_operation(cls, building_site: Point, queen: QueenAnt, worker: WorkerAnt, new_town: Town):
        return BuildNewTownOperation(building_site, queen, worker, new_town)

    def __init__(self, building_site: Point, queen: QueenAnt, worker: WorkerAnt, new_town: Town):
        self._building_site = building_site
        self._queen = queen
        self._worker = worker
        self._new_town = new_town

    def start_operation(self):
        (self._preparation_step()
            .on_done(self._walk_to_building_site_step)
            .on_done(self._building_town_step)
            .on_done(self._relocate_step))

    def _preparation_step(self):
        worker_task = self._worker.prepare_for_operation()
        queen_task = self._queen.prepare_for_operation()

        return TaskGroup.build_tasks_group([worker_task, queen_task])
    
    def _walk_to_building_site_step(self):
        worker_task = self._worker.walk_to(self._building_site)
        queen_task = self._queen.walk_to(self._building_site)

        return TaskGroup.build_tasks_group([worker_task, queen_task])
    
    def _building_town_step(self):
        queen_build_town_task = self._queen.build_new_town(self._new_town)

        return TaskGroup.build_tasks_group([queen_build_town_task])

    def _relocate_step(self):
        self._queen.relocate_to_town(self._new_town)
        self._queen.get_in_town(self._new_town)
        self._worker.relocate_to_town(self._new_town)
        self._queen.leave_operation()
        self._worker.leave_operation()

