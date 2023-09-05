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

    def __init__(self, events: EventEmitter, formation_factory: FormationFactory, id: int, hired_ants: List[Ant], flags: dict, nest: Nest, item: Item):
        super().__init__(events, formation_factory, id, OperationTypes.BRING_ITEM_TO_NEST, hired_ants, flags)
        self._name = 'перенести в гніздо'
        self._open_vacancies(AntTypes.WORKER, 3)
        self._add_marker(MarkerTypes.EAT, item.position)
        self._nest = nest
        self._item = item

    @property
    def _workers(self) -> List[WorkerAnt]:
        return self.get_hired_ants(AntTypes.WORKER)
    
    def _test_potential_member(self, ant: Ant):
        return ant.home_nest_id == self._nest.id

    def _init_staff(self):
        super()._init_staff()
        ants = self._workers
        self._leader_ant = ants[0]
        # formation = self._formation_factory.build_attack_formation(self._nest.position, WorkerAntBody.DISTANCE_PER_SEP)
        for ant in ants:
            ant.body.sayer.add_listener('prepared', partial(self._on_worker_prepared, ant))
            ant.body.sayer.add_listener('on_position', partial(self._on_worker_on_position, ant))
            ant.body.sayer.add_listener('at_nest', self._on_leader_ant_near_nest)
    
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
        self._leader_ant.pick_up_item(self._item)
        self._leader_ant.walk_to(self._nest.position, 'at_nest')

    def _on_leader_ant_near_nest(self):
        self._leader_ant.get_in_nest(self._nest)
        self._leader_ant.give_food(self._nest)

