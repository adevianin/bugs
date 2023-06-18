from core.world.utils.point import Point
from core.world.entities.task.task_group import TaskGroup
from core.world.entities.nest.nest import Nest
from .operation import Operation
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.utils.event_emiter import EventEmitter

class BuildNewNestOperation(Operation):
    
    def __init__(self, events: EventEmitter, building_site: Point, new_nest: Nest):
        super().__init__(events)
        self._building_site = building_site
        self._new_nest = new_nest
        self._name = 'новий мурашник'
        self._open_vacancies(AntTypes.WORKER, 1)
        self._open_vacancies(AntTypes.QUEEN, 1)
        self._add_pointer_marker(self._building_site)

    # def to_json(self):
    #     json = super().to_json()
    #     json.update({
    #         'markers': self._pointer_marker_to_json(self._building_site)
    #     })

    #     return json

    def _start_operation(self):
        self._worker = self._get_hired_ants(AntTypes.WORKER)[0]
        self._queen = self._get_hired_ants(AntTypes.QUEEN)[0]

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
        self._mark_as_done()