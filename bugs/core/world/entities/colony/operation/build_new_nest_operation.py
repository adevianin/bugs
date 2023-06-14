from core.world.entities.ant.queen.queen_ant import QueenAnt
from core.world.entities.ant.worker.worker_ant import WorkerAnt
from core.world.utils.point import Point
from core.world.entities.task.task_group import TaskGroup
from core.world.entities.nest.nest import Nest

class BuildNewNestOperation():

    @classmethod
    def build_build_new_nest_operation(cls, building_site: Point, queen: QueenAnt, worker: WorkerAnt, new_nest: Nest):
        return BuildNewNestOperation(building_site, queen, worker, new_nest)

    def __init__(self, building_site: Point, queen: QueenAnt, worker: WorkerAnt, new_nest: Nest):
        self._building_site = building_site
        self._queen = queen
        self._worker = worker
        self._new_nest = new_nest

    def start_operation(self):
        (self._preparation_step()
            .on_done(self._walk_to_building_site_step)
            .on_done(self._building_nest_step)
            .on_done(self._relocate_step))

    def _preparation_step(self):
        worker_task = self._worker.prepare_for_operation()
        queen_task = self._queen.prepare_for_operation()

        return TaskGroup.build_tasks_group([worker_task, queen_task])
    
    def _walk_to_building_site_step(self):
        worker_task = self._worker.walk_to(self._building_site)
        queen_task = self._queen.walk_to(self._building_site)

        return TaskGroup.build_tasks_group([worker_task, queen_task])
    
    def _building_nest_step(self):
        queen_build_nest_task = self._queen.build_new_nest(self._new_nest)

        return TaskGroup.build_tasks_group([queen_build_nest_task])

    def _relocate_step(self):
        self._queen.relocate_to_nest(self._new_nest)
        self._queen.get_in_nest(self._new_nest)
        self._worker.relocate_to_nest(self._new_nest)
        self._queen.leave_operation()
        self._worker.leave_operation()

