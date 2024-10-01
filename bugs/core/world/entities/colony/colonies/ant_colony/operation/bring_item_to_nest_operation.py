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
from core.world.entities.colony.colonies.ant_colony.operation.base.formation.formation_factory import FormationFactory
from core.world.entities.colony.colonies.ant_colony.operation.base.formation.base.base_formation import BaseFormation
from core.world.entities.colony.colonies.ant_colony.operation.base.formation.bring_item_formation import BringItemFormation
from .base.fight.fight_factory import FightFactory
from .base.fight.fight import Fight

from typing import List
from functools import partial

class BringItemToNestOperation(Operation):

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, formation_factory: FormationFactory, fight_factory: FightFactory, id: int, hired_ants: List[Ant], 
                 flags: dict, formation: BaseFormation, fight: Fight, nest: Nest, item: Item):
        self._nest = nest
        self._item = item
        super().__init__(event_bus, events, formation_factory, fight_factory, id, OperationTypes.BRING_ITEM_TO_NEST, hired_ants, flags, formation, fight)
        self._name = 'перенести в гніздо'
        self._open_vacancies(AntTypes.WORKER, 3)
        self._add_marker(MarkerTypes.EAT, item.position)

        self.events.add_listener('formation:bring_item:done', self._on_formation_reached_destination)

        self.events.add_listener('fight_won:preparing', self._prepare_step)
        self.events.add_listener('fight_won:walking_to_item', self._walk_to_item_step)
        self.events.add_listener('fight_won:bringging_item', self._walk_to_item_step)

        self.events.add_listener('hired_ant_died', self._on_ant_died)

        self._nest.events.add_listener('died', self.cancel)

    @property
    def nest_id(self):
        return self._nest.id

    @property
    def item_id(self):
        return self._item.id

    @property
    def _workers(self) -> List[WorkerAnt]:
        return self.get_hired_ants(AntTypes.WORKER)
    
    def _setup_operation(self):
        super()._setup_operation()
        ants = self._workers

        for ant in ants:
            ant.body.sayer.add_listener('prepared', partial(self._on_worker_prepared, ant))
            ant.body.sayer.add_listener('on_position', partial(self._on_worker_on_position, ant))

        self._item.please_do_not_die()

    def _on_operation_stop(self):
        super()._on_operation_stop()
        self._nest.events.remove_listener('died', self.cancel)
        if not self._item.is_died:
            self._item.refresh_life_span()

    def _start_operation(self):
        super()._start_operation()
        self._item.please_do_not_die()
        self._prepare_step()

    def _prepare_step(self):
        self._stage = 'preparing'
        for ant in self._workers:
            self._write_flag(f'worker_{ant.id}_prepared', False)
            ant.prepare_for_operation(self._assemble_point, 'prepared')

    def _on_worker_prepared(self, ant: WorkerAnt):
        self._write_flag(f'worker_{ant.id}_prepared', True)
        if self._check_are_all_workers_prepared():
            self._walk_to_item_step()

    def _check_are_all_workers_prepared(self):
        for ant in self._workers:
            if not self._read_flag(f'worker_{ant.id}_prepared'):
                return False
        return True

    def _walk_to_item_step(self):
        self._stage = 'walking_to_item'
        for ant in self._workers:
            self._write_flag(f'worker_{ant.id}_on_position', False)
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
        self._stage = 'bringging_item'
        formation = self._formation_factory.build_bring_item_formation('bring_item', self._workers, self._nest.position, self._item)
        self._register_formation(formation)

    def _on_formation_reached_destination(self):
        self._nest.take_edible_item(self._item)
        self.done()

    def _on_ant_died(self, ant: Ant):
        self.cancel()
