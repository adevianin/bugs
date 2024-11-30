from core.world.entities.colony.colonies.ant_colony.operation.base.operation import Operation
from core.world.entities.colony.colonies.ant_colony.operation.base.operation_types import OperationTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.colony.colonies.ant_colony.operation.base.formation.formation_factory import FormationFactory
from core.world.entities.colony.colonies.ant_colony.operation.base.formation.base.base_formation import BaseFormation
from core.world.entities.ant.base.ant import Ant
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.nest.nest import Nest
from core.world.entities.colony.colonies.ant_colony.operation.base.marker_types import MarkerTypes
from .base.fight.fight_factory import FightFactory
from .base.fight.fight import Fight

from typing import List
from functools import partial

class TransportFoodOperation(Operation):

    class Flags(Operation.Flags):
        ANT_FLAG_NEAR_NEST_FROM = 'near_nest_from'
        ANT_FLAG_WAITED_IN_NEST_FROM = 'waited_in_nest_from'
        ANT_FLAG_NEAR_NEST_TO = 'near_nest_to'
        ANT_FLAG_WAITED_IN_NEST_TO = 'waited_in_nest_to'

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, formation_factory: FormationFactory, fight_factory: FightFactory, id: int, hired_ants: List[Ant], flags: dict, 
                 formation: BaseFormation, fight: Fight, worker_vacancies_count: int, warrior_vacancies_count: int, nest_from: Nest, nest_to: Nest):
        super().__init__(event_bus, events, formation_factory, fight_factory, id, OperationTypes.TRANSPORT_FOOD, hired_ants, flags, formation, fight, worker_vacancies_count, warrior_vacancies_count)
        self._name = 'перенести їжу'
        self._open_vacancies(AntTypes.WORKER, self._worker_vacancies_count)
        self._open_vacancies(AntTypes.WARRIOR, self._warrior_vacancies_count)
        self._add_marker(MarkerTypes.EAT, nest_from.position)
        self._add_marker(MarkerTypes.EAT, nest_to.position)

        self._nest_from = nest_from
        self._nest_to = nest_to
        self._nest_from_removal_block_id = self._nest_from.block_removal()
        self._nest_to_removal_block_id = self._nest_to.block_removal()

    @property
    def nest_from_id(self):
        return self._nest_from.id

    @property
    def nest_to_id(self):
        return self._nest_to.id
    
    def cancel(self):
        self._workers_drop_picked_item()
        super().cancel()
    
    def _setup_operation(self):
        super()._setup_operation()

        self.events.add_listener('formation:march_to_nest_from:done', self._approaching_nest_from_step)
        self.events.add_listener('formation:march_to_nest_to:done', self._approaching_nest_to_step)

        self.events.add_listener('fight_won:march_to_nest_from', self._has_sufficient_workers_step_decorator(self._march_to_nest_from_step))
        self.events.add_listener('fight_won:approaching_nest_from', self._has_sufficient_workers_step_decorator(self._approaching_nest_from_step))
        self.events.add_listener('fight_start:march_to_nest_to', self._workers_drop_picked_item)
        self.events.add_listener('fight_won:march_to_nest_to', self._march_to_assemble_point_for_completion_step)
        self.events.add_listener('fight_start:approaching_nest_to', self._workers_drop_picked_item)
        self.events.add_listener('fight_won:approaching_nest_to', self._march_to_assemble_point_for_completion_step)

        for ant in self._workers: 
            ant.body.sayer.add_listener('worker_is_near_nest_from', partial(self._on_worker_is_near_nest_from, ant))
            ant.body.sayer.add_listener('worker_waited_in_nest_from', partial(self._on_worker_waited_in_nest_from, ant))
            ant.body.sayer.add_listener('worker_is_near_nest_to', partial(self._on_worker_is_near_nest_to, ant))
            ant.body.sayer.add_listener('worker_waited_in_nest_to', partial(self._on_worker_waited_in_nest_to, ant))

    def _on_operation_stop(self):
        super()._on_operation_stop()
        self._nest_from.unblock_removal(self._nest_from_removal_block_id)
        self._nest_to.unblock_removal(self._nest_to_removal_block_id)

    def _start_operation(self):
        super()._start_operation()
        self._prepare_step()

    def _on_all_ants_prepared(self):
        self._march_to_nest_from_step()

    def _march_to_nest_from_step(self):
        self._stage = 'march_to_nest_from'
        units = self._all_ants_for_march
        if BaseFormation.check_is_formation_needed(units, self._nest_from.position):
            formation = self._formation_factory.build_convoy_formation('march_to_nest_from', units, self._nest_from.position)
            self._register_formation(formation)
        else:
            self._approaching_nest_from_step()

    def _approaching_nest_from_step(self):
        self._stage = 'approaching_nest_from'
        for ant in self._workers:
            self._write_ant_flag(ant, self.Flags.ANT_FLAG_NEAR_NEST_FROM, False)
            ant.walk_to(self._nest_from.position, 'worker_is_near_nest_from')

        for ant in self._warriors:
            ant.keep_clear_territory(self._nest_from.position, 100)

    def _on_worker_is_near_nest_from(self, ant: Ant):
        self._write_ant_flag(ant, self.Flags.ANT_FLAG_NEAR_NEST_FROM, True)
        if self._check_ant_flag_for_ants(self._workers, self.Flags.ANT_FLAG_NEAR_NEST_FROM):
            self._get_in_nest_from_step()

    def _get_in_nest_from_step(self):
        if self._nest_from.is_died:
            self._march_to_assemble_point_for_completion_step()
            return
        
        for ant in self._workers:
            ant.get_in_nest(self._nest_from)
            self._write_ant_flag(ant, self.Flags.ANT_FLAG_WAITED_IN_NEST_FROM, False)
            ant.wait_step(1, 'worker_waited_in_nest_from')

    def _on_worker_waited_in_nest_from(self, ant: Ant):
        self._write_ant_flag(ant, self.Flags.ANT_FLAG_WAITED_IN_NEST_FROM, True)
        if self._check_ant_flag_for_ants(self._workers, self.Flags.ANT_FLAG_WAITED_IN_NEST_FROM):
            self._get_food_from_nest_step()

    def _get_food_from_nest_step(self):
        for ant in self._workers:
            ant.get_food_item_from_nest(self._nest_from)

        self._march_to_nest_to_step()

    def _march_to_nest_to_step(self):
        self._stage = 'march_to_nest_to'
        units = self._all_ants_for_march
        if BaseFormation.check_is_formation_needed(units, self._nest_to.position):
            formation = self._formation_factory.build_convoy_formation('march_to_nest_to', units, self._nest_to.position)
            self._register_formation(formation)
        else:
            self._approaching_nest_to_step()

    def _approaching_nest_to_step(self):
        self._stage = 'approaching_nest_to'
        for ant in self._workers:
            self._write_ant_flag(ant, self.Flags.ANT_FLAG_NEAR_NEST_TO, False)
            ant.walk_to(self._nest_to.position, 'worker_is_near_nest_to')

        for ant in self._warriors:
            ant.keep_clear_territory(self._nest_to.position, 100)

    def _on_worker_is_near_nest_to(self, ant: Ant):
        self._write_ant_flag(ant, self.Flags.ANT_FLAG_NEAR_NEST_TO, True)
        if self._check_ant_flag_for_ants(self._workers, self.Flags.ANT_FLAG_NEAR_NEST_TO):
            self._getting_inside_nest_to_step()

    def _getting_inside_nest_to_step(self):
        if self._nest_to.is_died:
            self._workers_drop_picked_item()
            self._march_to_assemble_point_for_completion_step()
            return
        
        for ant in self._workers:
            ant.get_in_nest(self._nest_to)
            self._write_ant_flag(ant, self.Flags.ANT_FLAG_WAITED_IN_NEST_TO, False)
            ant.wait_step(1, 'worker_waited_in_nest_to')

    def _on_worker_waited_in_nest_to(self, ant: Ant):
        self._write_ant_flag(ant, self.Flags.ANT_FLAG_WAITED_IN_NEST_TO, True)
        if self._check_ant_flag_for_ants(self._workers, self.Flags.ANT_FLAG_WAITED_IN_NEST_TO):
            self._give_food_to_nest_to_step()

    def _give_food_to_nest_to_step(self):
        for ant in self._workers:
            if ant.has_picked_item():
                ant.get_in_nest(self._nest_to)
                ant.give_food(self._nest_to)
        
        self._march_to_assemble_point_for_completion_step()
