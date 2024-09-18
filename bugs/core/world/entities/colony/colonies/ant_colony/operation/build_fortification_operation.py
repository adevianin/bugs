from core.world.entities.colony.colonies.ant_colony.operation.base.operation import Operation
from core.world.entities.colony.colonies.ant_colony.operation.base.operation_types import OperationTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.colony.colonies.ant_colony.operation.base.formation.formation_factory import FormationFactory
from core.world.entities.colony.colonies.ant_colony.operation.base.formation.base.base_formation import BaseFormation
from core.world.entities.ant.base.ant import Ant
from core.world.entities.ant.worker.worker_ant import WorkerAnt
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.nest.nest import Nest
from core.world.entities.colony.colonies.ant_colony.operation.base.marker_types import MarkerTypes

# from core.world.my_test_env import MY_TEST_ENV

from typing import List
from functools import partial

class BuildFortificationOperation(Operation):

    def __init__(self, events: EventEmitter, formation_factory: FormationFactory, id: int, hired_ants: List[Ant], flags: dict, formations: List[BaseFormation], nest: Nest, workers_count: int):
        super().__init__(events, formation_factory, id, OperationTypes.BUILD_FORTIFICATION, hired_ants, flags, formations)
        self._nest = nest
        self._workers_count = workers_count
        self._name = 'будування фортицікацій'
        self._open_vacancies(AntTypes.WORKER, workers_count)
        self._add_marker(MarkerTypes.POINTER, self._nest.position)

        self._nest.events.add_listener('is_under_attack', self._on_nest_is_under_attack)

    @property
    def nest_id(self):
        return self._nest.id
    
    @property
    def workers_count(self):
        return self._workers_count
    
    def _on_operation_stop(self):
        self._nest.events.remove_listener('is_under_attack', self._on_nest_is_under_attack)
        super()._on_operation_stop()

    @property
    def _workers(self) -> List[WorkerAnt]:
        return self.get_hired_ants(AntTypes.WORKER)
    
    def _init_staff(self):
        super()._init_staff()

        for ant in self._hired_ants:
            ant.body.sayer.add_listener('prepared', partial(self._on_ant_prepared, ant))
            ant.body.sayer.add_listener('arrived_to_fortificating_nest', partial(self._on_ant_arrived_to_fortificating_nest, ant))
            ant.body.sayer.add_listener('added_fortification_piece', partial(self._on_ant_added_fortification_piece, ant))

    def _start_operation(self):
        super()._start_operation()
        self._prepare_step()

    def _prepare_step(self):
        for ant in self._hired_ants:
            ant.prepare_for_operation('prepared')

    def _on_ant_prepared(self, ant: Ant):
        self._write_flag(f'ant_{ant.id}_prepared', True)
        if self._check_are_all_ants_prepared():
            self._go_to_nest()

    def _check_are_all_ants_prepared(self):
        for ant in self._hired_ants:
            if not self._read_flag(f'ant_{ant.id}_prepared'):
                return False
        return True
    
    def _go_to_nest(self):
        for ant in self._hired_ants:
            ant.walk_to(self._nest.position, 'arrived_to_fortificating_nest')

    def _on_ant_arrived_to_fortificating_nest(self, ant: Ant):
        ant.build_fortification(self._nest, 'added_fortification_piece')

    def _on_ant_added_fortification_piece(self, ant: Ant):
        if self._nest.fortification >= self._nest.stats.max_fortification:
            self.done()
        else:
            ant.build_fortification(self._nest, 'added_fortification_piece')

    def _on_nest_is_under_attack(self, enemies_positions):
        self.cancel()