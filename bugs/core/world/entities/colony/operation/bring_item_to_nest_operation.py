from core.world.entities.ant.base.ant import Ant
from .operation import Operation
from .marker_types import MarkerTypes
from core.world.entities.colony.operation.operation_types import OperationTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.colony.formation.formation_factory import FormationFactory
from core.world.entities.ant.base.ant import Ant
from core.world.entities.ant.worker.worker_ant import WorkerAnt
from core.world.entities.ant.worker.worker_ant_body import WorkerAntBody
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.nest.nest import Nest
from core.world.entities.item.item import Item

from typing import List
from functools import partial

class BringItemToNestOperation(Operation):

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, formation_factory: FormationFactory, id: int, hired_ants: List[Ant], flags: dict, nest: Nest, item: Item):
        super().__init__(events, formation_factory, id, OperationTypes.BRING_ITEM_TO_NEST, hired_ants, flags)
        self._event_bus = event_bus
        self._name = 'перенести в гніздо'
        self._open_vacancies(AntTypes.WORKER, 3)
        self._add_marker(MarkerTypes.EAT, item.position)
        self._nest = nest
        self._item = item

        # self._event_bus.add_listener('step_start', self._on_start_step)

    @property
    def _workers(self) -> List[WorkerAnt]:
        return self.get_hired_ants(AntTypes.WORKER)
    
    def _test_potential_member(self, ant: Ant):
        return ant.home_nest_id == self._nest.id

    def _init_staff(self):
        super()._init_staff()
        ants = self._workers
        self._formation = self._formation_factory.build_bring_item_formation(self._nest.position, WorkerAntBody.DISTANCE_PER_SEP, self._item)
        self._item_formation_unit_number = self._formation.register_unit(self._item.position)
        for ant in ants:
            ant.set_formation(self._formation)
            ant.body.sayer.add_listener('prepared', partial(self._on_worker_prepared, ant))
            ant.body.sayer.add_listener('on_position', partial(self._on_worker_on_position, ant))

    # def _on_start_step(self, step_number):
    #     if self._read_flag('is_bring_step_started'):
    #         self._bring_item_in_formation()
    
    def _start_operation(self):
        super()._start_operation()
        self._prepare_step()

    def _prepare_step(self):
        for ant in self._workers:
            ant.prepare_for_operation('prepared')

    def _on_worker_prepared(self, ant: WorkerAnt):
        self._write_flag(f'worker_{ant.id}_prepared', True)
        if self._check_are_all_workers_prepared():
            self._walk_step()

    def _check_are_all_workers_prepared(self):
        for ant in self._workers:
            if not self._read_flag(f'worker_{ant.id}_prepared'):
                return False
        return True

    def _walk_step(self):
        for ant in self._workers:
            ant.walk_to(self._item.position, 'on_position')

    def _on_worker_on_position(self, ant: Ant):
        self._write_flag(f'worker_{ant.id}_on_position', True)
        if self._check_are_all_workers_on_position():
            self._bring_step()

    def _check_are_all_workers_on_position(self):
        for ant in self._workers:
            if not self._read_flag(f'worker_{ant.id}_on_position'):
                return False
        return True
    
    def _bring_step(self):
        self._write_flag('is_bring_step_started', True)
        self._bring_item_in_formation()
        ants = self._workers
        for ant in ants:
            ant.walk_in_formation()

    def _bring_item_in_formation(self):
        item_pos = self._formation.get_position_for_unit(self._item_formation_unit_number)
        bring_user_speed = self._workers[0].body.user_speed
        self._item.be_bringed(item_pos, bring_user_speed)
        self._formation.unit_changed_position(item_pos, self._item_formation_unit_number)
        print('item step in formation', item_pos)

    # def _on_operation_stop(self):
    #     self._event_bus.remove_listener('start_step', self._on_start_step)
    
