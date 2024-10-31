from core.world.entities.colony.colonies.ant_colony.operation.base.operation import Operation
from core.world.entities.colony.colonies.ant_colony.operation.base.operation_types import OperationTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.colony.colonies.ant_colony.operation.base.formation.formation_factory import FormationFactory
from core.world.entities.colony.colonies.ant_colony.operation.base.formation.base.base_formation import BaseFormation
from core.world.entities.ant.base.ant import Ant
from core.world.entities.ant.worker.worker_ant import WorkerAnt
from core.world.entities.ant.warrior.warrior_ant import WarriorAnt
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.nest.nest import Nest
from core.world.entities.colony.colonies.ant_colony.operation.base.marker_types import MarkerTypes
from .base.fight.fight_factory import FightFactory
from .base.fight.fight import Fight

from typing import List
from functools import partial

class TransportFoodOperation(Operation):

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, formation_factory: FormationFactory, fight_factory: FightFactory, id: int, hired_ants: List[Ant], flags: dict, 
                 formation: BaseFormation, fight: Fight, nest_from: Nest, nest_to: Nest, workers_count: int, warriors_count: int):
        super().__init__(event_bus, events, formation_factory, fight_factory, id, OperationTypes.TRANSPORT_FOOD, hired_ants, flags, formation, fight)
        self._nest_from = nest_from
        self._nest_to = nest_to
        self._workers_count = workers_count
        self._warriors_count = warriors_count
        self._name = 'перенести їжу'
        self._open_vacancies(AntTypes.WORKER, workers_count)
        self._open_vacancies(AntTypes.WARRIOR, warriors_count)
        self._add_marker(MarkerTypes.EAT, self._nest_from.position)
        self._add_marker(MarkerTypes.EAT, self._nest_to.position)

        self.events.add_listener('formation:go_to_nest_from:done', self._on_formation_go_to_nest_from_done)
        self.events.add_listener('formation:go_to_nest_to:done', self._on_formation_go_to_nest_to_done)
        self.events.add_listener('formation:march_to_assemble_point_to_stop_operation:done', self.done)

        self.events.add_listener('fight_won:preparing', self._prepare_step)
        self.events.add_listener('fight_won:formation_to_nest_from', self._go_to_nest_from_step)
        self.events.add_listener('fight_won:getting_to_nest_from', self._getting_to_nest_from_step)
        self.events.add_listener('fight_start:got_food', self._drop_picked_food)
        self.events.add_listener('fight_won:got_food', self._go_to_nest_to_step)
        self.events.add_listener('fight_start:getting_to_nest_to', self._drop_picked_food)
        self.events.add_listener('fight_won:getting_to_nest_to', self.cancel)

        self._nest_from_removal_block_id = self._nest_from.block_removal()
        self._nest_to_removal_block_id = self._nest_to.block_removal()

    @property
    def nest_from_id(self):
        return self._nest_from.id

    @property
    def nest_to_id(self):
        return self._nest_to.id
    
    @property
    def workers_count(self):
        return self._workers_count
    
    @property
    def warriors_count(self):
        return self._warriors_count

    @property
    def _workers(self) -> List[WorkerAnt]:
        return self.get_hired_ants(AntTypes.WORKER)
    
    @property
    def _warriors(self) -> List[WarriorAnt]:
        return self.get_hired_ants(AntTypes.WARRIOR)
    
    def _setup_operation(self):
        super()._setup_operation()

        for ant in self._hired_ants:
            ant.body.sayer.add_listener('prepared', partial(self._on_ant_prepared, ant))

        for ant in self._workers: 
            ant.body.sayer.add_listener('worker_is_near_nest_from', partial(self._on_worker_is_near_nest_from, ant))
            ant.body.sayer.add_listener('worker_waited_in_nest_from', partial(self._on_worker_waited_in_nest_from, ant))
            ant.body.sayer.add_listener('worker_is_near_nest_to', partial(self._on_worker_is_near_nest_to, ant))

    def _on_operation_stop(self):
        super()._on_operation_stop()
        self._nest_from.unblock_removal(self._nest_from_removal_block_id)
        self._nest_to.unblock_removal(self._nest_to_removal_block_id)

    def _start_operation(self):
        super()._start_operation()
        self._prepare_step()

    def _prepare_step(self):
        self._stage = 'preparing'
        for ant in self._hired_ants:
            self._write_flag(f'ant_{ant.id}_prepared', False)
            ant.prepare_for_operation(self._assemble_point, 'prepared')

    def _on_ant_prepared(self, ant: Ant):
        self._write_flag(f'ant_{ant.id}_prepared', True)
        if self._check_are_all_ants_prepared():
            self._go_to_nest_from_step()

    def _check_are_all_ants_prepared(self):
        for ant in self._hired_ants:
            if not self._read_flag(f'ant_{ant.id}_prepared'):
                return False
        return True
    
    def _go_to_nest_from_step(self):
        self._stage = 'formation_to_nest_from'
        formation = self._formation_factory.build_convoy_formation('go_to_nest_from', self._warriors + self._workers, self._nest_from.position)
        self._register_formation(formation)

    def _on_formation_go_to_nest_from_done(self):
        self._getting_to_nest_from_step()

    def _getting_to_nest_from_step(self):
        self._stage = 'getting_to_nest_from'
        for ant in self._workers:
            self._write_flag(f'worker_{ant.id}_is_near_nest_from', False)
            ant.walk_to(self._nest_from.position, 'worker_is_near_nest_from')

        for ant in self._warriors:
            ant.keep_clear_territory(self._nest_from.position, 100)

    def _on_worker_is_near_nest_from(self, ant: Ant):
        self._write_flag(f'worker_{ant.id}_is_near_nest_from', True)
        if self._check_are_all_workers_near_nest_from():
            self._get_in_nest_from_step()

    def _check_are_all_workers_near_nest_from(self):
        for ant in self._workers:
            if not self._read_flag(f'worker_{ant.id}_is_near_nest_from'):
                return False
        return True

    def _get_in_nest_from_step(self):
        if self._nest_from.is_died:
            self._march_to_assemble_point_to_stop_operation_step()
            return
        
        for ant in self._workers:
            ant.get_in_nest(self._nest_from)
            self._write_flag(f'is_worker_{ant.id}_waited_in_nest_from', False)
            ant.wait_step(1, 'worker_waited_in_nest_from')

    def _on_worker_waited_in_nest_from(self, ant: Ant):
        self._write_flag(f'is_worker_{ant.id}_waited_in_nest_from', True)
        if self._check_are_all_workers_waited_in_nest_from():
            self._get_food_from_nest_step()

    def _check_are_all_workers_waited_in_nest_from(self):
        for ant in self._workers:
            if not self._read_flag(f'is_worker_{ant.id}_waited_in_nest_from'):
                return False
        return True
    
    def _get_food_from_nest_step(self):
        self._stage = 'got_food'
        for ant in self._workers:
            ant.get_food_item_from_nest(self._nest_from)
            ant.get_out_of_nest()
        for ant in self._warriors:
            ant.free_mind()

        self._go_to_nest_to_step()

    def _go_to_nest_to_step(self):
        formation = self._formation_factory.build_convoy_formation('go_to_nest_to', self._warriors + self._workers, self._nest_to.position)
        self._register_formation(formation)

    def _on_formation_go_to_nest_to_done(self):
        self._stage = 'getting_to_nest_to'
        for ant in self._workers:
            self._write_flag(f'is_worker_{ant.id}_near_nest_to', False)
            ant.walk_to(self._nest_to.position, 'worker_is_near_nest_to')

        for ant in self._warriors:
            ant.keep_clear_territory(self._nest_to.position, 100)

    def _on_worker_is_near_nest_to(self, ant: Ant):
        self._write_flag(f'is_worker_{ant.id}_near_nest_to', True)
        if self._check_are_all_workers_near_nest_to():
            self._give_food_to_nest_to_step()

    def _check_are_all_workers_near_nest_to(self):
        for ant in self._workers:
            if not self._read_flag(f'is_worker_{ant.id}_near_nest_to'):
                return False
        return True

    def _give_food_to_nest_to_step(self):
        if self._nest_to.is_died:
            self._drop_picked_food()
            self._march_to_assemble_point_to_stop_operation_step()
            return
        
        for ant in self._workers:
            if ant.has_picked_item():
                ant.get_in_nest(self._nest_to)
                ant.give_food(self._nest_to)
        
        self.done()

    def _drop_picked_food(self):
        for ant in self._workers:
            if ant.has_picked_item():
                ant.drop_picked_item()

    def _march_to_assemble_point_to_stop_operation_step(self):
        formation = self._formation_factory.build_convoy_formation('march_to_assemble_point_to_stop_operation', self._warriors + self._workers, self._assemble_point)
        self._register_formation(formation)
