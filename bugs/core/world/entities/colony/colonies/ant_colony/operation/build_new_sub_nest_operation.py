from core.world.utils.point import Point
from core.world.entities.colony.colonies.ant_colony.operation.base.operation import Operation
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.colony.colonies.ant_colony.operation.base.operation_types import OperationTypes
from core.world.entities.ant.base.ant import Ant
from core.world.entities.ant.worker.worker_ant import WorkerAnt
from core.world.entities.nest.nest import Nest
from core.world.entities.colony.colonies.ant_colony.operation.base.marker_types import MarkerTypes
from core.world.entities.ant.base.larva import Larva
from core.world.entities.colony.colonies.ant_colony.formation.base.formation_manager import FormationManager

from typing import List
from functools import partial

class BuildNewSubNestOperation(Operation):
    
    def __init__(self, events: EventEmitter, formation_manager: FormationManager, id: int, hired_ants: List[Ant], flags: dict, building_site: Point, workers_count: int):
        super().__init__(events, formation_manager, id, OperationTypes.BUILD_NEW_SUB_NEST, hired_ants, flags)
        self._building_site = building_site
        self._workers_count = workers_count
        self._name = 'новий мурашник'
        self._open_vacancies(AntTypes.WORKER, self._workers_count)
        self._add_marker(MarkerTypes.POINTER, self._building_site)

    @property
    def building_site(self):
        return self._building_site
    
    @property
    def workers_count(self):
        return self._workers_count
    
    def _init_staff(self):
        super()._init_staff()

        self._workers = self.get_hired_ants(AntTypes.WORKER)

        for worker in self._workers:
            worker.sayer.add_listener('prepared', partial(self._on_worker_prepared, worker))
            worker.sayer.add_listener('arrived_to_building_site', partial(self._on_worker_on_building_site, worker))
            worker.sayer.add_listener('nest_is_found', self._on_nest_found)
            worker.sayer.add_listener('nest_is_built', self._on_nest_built)
            

        # self._queen: QueenAnt = self.get_hired_ants(AntTypes.QUEEN)[0]

        # self._queen.body.sayer.add_listener('arrived_to_building_site', self._on_queen_arrived_to_building_site)
        # self._queen.body.sayer.add_listener('nest_is_found', self._on_queen_found_nest)
        # self._queen.body.sayer.add_listener('nest_is_built', self._on_nest_built)

    def _start_operation(self):
        super()._start_operation()
        self._prepare_step()
    
    def _prepare_step(self):
        for worker in self._workers:
            worker.prepare_for_operation('prepared')

    def _on_worker_prepared(self, worker: WorkerAnt):
        self._write_flag(f'worker_{worker.id}_prepared', True)
        if self._check_are_all_workers_prepared():
            self._walk_to_building_site_step()

    def _check_are_all_workers_prepared(self):
        for worker in self._workers:
            if not self._read_flag(f'worker_{worker.id}_prepared'):
                return False
        return True

    def _walk_to_building_site_step(self):
        for worker in self._workers:
            worker.walk_to(self._building_site, 'arrived_to_building_site')

    def _on_worker_on_building_site(self, worker: WorkerAnt):
        self._write_flag(f'worker_{worker.id}_arrived_to_building_site', True)
        if self._check_are_all_workers_arrived_to_building_site():
            self._found_nest_step()
    
    def _check_are_all_workers_arrived_to_building_site(self):
        for worker in self._workers:
            if not self._read_flag(f'worker_{worker.id}_arrived_to_building_site'):
                return False
        return True

    def _found_nest_step(self):
        self._workers[0].found_nest(self._building_site, 'nest_is_found')

    def _on_nest_found(self, results):
        nest: Nest = results['nest']
        for worker in self._workers:
            worker.build_nest(nest, 'nest_is_built')

    def _on_nest_built(self, nest: Nest):
        if not self._read_flag(f'relocate_step_started'):
            self._write_flag(f'relocate_step_started', True)
            nest.take_calories(500)
            for worker in self._workers:
                worker.relocate_to_nest(nest)
            self.done()
