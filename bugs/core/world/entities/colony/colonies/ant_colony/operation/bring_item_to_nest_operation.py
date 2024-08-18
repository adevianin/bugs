from core.world.entities.ant.base.ant import Ant
from core.world.entities.colony.colonies.ant_colony.operation.base.operation import Operation
from core.world.entities.colony.colonies.ant_colony.operation.base.marker_types import MarkerTypes
from core.world.entities.colony.colonies.ant_colony.operation.base.operation_types import OperationTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.ant.base.ant import Ant
from core.world.entities.ant.worker.worker_ant import WorkerAnt
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.nest.nest import Nest
from core.world.entities.item.items.base.item import Item
from core.world.entities.colony.colonies.ant_colony.formation.base.formation_manager import FormationManager
from core.world.entities.colony.colonies.ant_colony.formation.bring_item_formation import BringItemFormation


from typing import List
from functools import partial

class BringItemToNestOperation(Operation):

    def __init__(self, events: EventEmitter, formation_manager: FormationManager, id: int, hired_ants: List[Ant], flags: dict, nest: Nest, item: Item, bring_item_formation: BringItemFormation = None):
        self._nest = nest
        self._item = item
        self._bring_item_formation = bring_item_formation
        super().__init__(events, formation_manager, id, OperationTypes.BRING_ITEM_TO_NEST, hired_ants, flags)
        self._name = 'перенести в гніздо'
        self._open_vacancies(AntTypes.WORKER, 3)
        self._add_marker(MarkerTypes.EAT, item.position)

    @property
    def nest_id(self):
        return self._nest.id

    @property
    def item_id(self):
        return self._item.id
    
    @property
    def bring_item_formation(self) -> BringItemFormation:
        return self._bring_item_formation

    @property
    def _workers(self) -> List[WorkerAnt]:
        return self.get_hired_ants(AntTypes.WORKER)
    
    # def _test_potential_member(self, ant: Ant):
    #     return ant.home_nest_id == self._nest.id

    def _init_staff(self):
        super()._init_staff()
        ants = self._workers

        # TODO add formation to manager
        self._bring_item_formation = self._bring_item_formation or self._formation_manager.prepare_bring_item_formation(units=self._workers, dest_point=self._nest.position, item=self._item)
        self._bring_item_formation.events.add_listener('reached_destination', self._on_formation_reached_destination)

        for ant in ants:
            ant.body.sayer.add_listener('prepared', partial(self._on_worker_prepared, ant))
            ant.body.sayer.add_listener('on_position', partial(self._on_worker_on_position, ant))

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
        self._bring_item_formation.activate()

    def _on_formation_reached_destination(self):
        self._nest.take_edible_item(self._item)
        self.done()
