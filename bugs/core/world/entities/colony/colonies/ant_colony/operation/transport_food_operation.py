from core.world.entities.colony.colonies.ant_colony.operation.base.operation import Operation
from core.world.entities.colony.colonies.ant_colony.operation.base.operation_types import OperationTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.colony.colonies.ant_colony.formation.base.formation_manager import FormationManager
from core.world.entities.ant.base.ant import Ant
from core.world.entities.ant.worker.worker_ant import WorkerAnt
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.nest.nest import Nest
from core.world.entities.colony.colonies.ant_colony.operation.base.marker_types import MarkerTypes

from typing import List
from functools import partial

class TransportFoodOperation(Operation):

    def __init__(self, events: EventEmitter, formation_manager: FormationManager, id: int, hired_ants: List[Ant], flags: dict, nest_from: Nest, nest_to: Nest, food_count: int, transported_food_count: int, workers_count: int):
        super().__init__(events, formation_manager, id, OperationTypes.TRANSPORT_FOOD, hired_ants, flags)
        self._nest_from = nest_from
        self._nest_to = nest_to
        self._food_count = food_count
        self._transported_food_count = transported_food_count
        self._workers_count = workers_count
        self._name = 'перенести їжу'
        self._open_vacancies(AntTypes.WORKER, workers_count)
        self._add_marker(MarkerTypes.EAT, self._nest_from.position)
        self._add_marker(MarkerTypes.EAT, self._nest_to.position)

    @property
    def _workers(self) -> List[WorkerAnt]:
        return self.get_hired_ants(AntTypes.WORKER)
    
    def _init_staff(self):
        super()._init_staff()

        ants = self._workers
        for ant in ants:
            ant.body.sayer.add_listener('prepared', partial(self._on_worker_prepared, ant))

    def _start_operation(self):
        super()._start_operation()
        self._prepare_step()

    def _prepare_step(self):
        for ant in self._workers:
            ant.prepare_for_operation('prepared')

    def _on_worker_prepared(self, ant: WorkerAnt):
        self._write_flag(f'worker_{ant.id}_prepared', True)
        if self._check_are_all_workers_prepared():
            self._go_for_food_step()

    def _check_are_all_workers_prepared(self):
        for ant in self._workers:
            if not self._read_flag(f'worker_{ant.id}_prepared'):
                return False
        return True
    
    def _go_for_food_step(self):
        print('go to nest')

