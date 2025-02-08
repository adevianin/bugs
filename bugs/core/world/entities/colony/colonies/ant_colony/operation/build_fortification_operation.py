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

class BuildFortificationOperation(Operation):

    MIN_WORKERS_COUNT = 1
    MAX_WARRIORS_COUNT = 0
    MIN_WARRIORS_COUNT = 0

    class Flags(Operation.Flags):
        ANT_FLAG_NEAR_NEST = 'near_nest'
        IS_FINISH_STEP_STARTED = 'is_finish_step_started'

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, formation_factory: FormationFactory, fight_factory: FightFactory, id: int, hired_ants: List[Ant], 
                 flags: dict, formation: BaseFormation, fight: Fight, worker_vacancies_count: int, nest: Nest):
        super().__init__(event_bus, events, formation_factory, fight_factory, id, OperationTypes.BUILD_FORTIFICATION, hired_ants, flags, formation, fight, worker_vacancies_count, 0)
        self._nest = nest
        self._name = 'будування фортицікацій'
        self._open_vacancies(AntTypes.WORKER, self._worker_vacancies_count)
        self._add_marker(MarkerTypes.SHIELD, self._nest.position)

        self._nest_removal_block_id = self._nest.block_removal()

    @property
    def nest_id(self):
        return self._nest.id
    
    def _on_operation_stop(self):
        super()._on_operation_stop()
        self._nest.unblock_removal(self._nest_removal_block_id)

    def _setup_operation(self):
        super()._setup_operation()

        self.events.add_listener('formation:march_to_nest:done', self._approach_nest_step)

        self.events.add_listener('fight_start:march_to_nest', self._workers_drop_picked_item)
        self.events.add_listener('fight_won:march_to_nest', self._march_to_nest_step)
        
        for ant in self._hired_ants:
            ant.body.sayer.add_listener('arrived_to_fortificating_nest', partial(self._on_ant_arrived_to_fortificating_nest, ant))
            ant.body.sayer.add_listener('build_fortification_thought_done', partial(self._on_ant_build_fortification_thought_done, ant))

    def _start_operation(self):
        super()._start_operation()
        self._prepare_step()

    def _on_all_ants_prepared(self):
        self._march_to_nest_step()

    def _march_to_nest_step(self):
        self._stage = 'march_to_nest'
        units = self._hired_ants
        if self._check_is_formation_needed(units, self._nest.position):
            formation = self._formation_factory.build_convoy_formation('march_to_nest', units, self._nest.position)
            self._register_formation(formation)
        else:
            self._approach_nest_step()

    def _approach_nest_step(self):
        for ant in self._hired_ants:
            self._write_ant_flag(ant, self.Flags.ANT_FLAG_NEAR_NEST, False)
            ant.walk_to(self._nest.position, 'arrived_to_fortificating_nest')

    def _on_ant_arrived_to_fortificating_nest(self, ant: Ant):
        self._write_ant_flag(ant, self.Flags.ANT_FLAG_NEAR_NEST, True)
        if self._check_ant_flag_for_ants(self._hired_ants, self.Flags.ANT_FLAG_NEAR_NEST):
            self._build_fortifications_step()

    def _build_fortifications_step(self):
        if self._nest.is_died:
            self._finish_step()
            return
        
        for ant in self._hired_ants:
            self._order_ant_build_fortifications(ant)

    def _order_ant_build_fortifications(self, ant: Ant):
        ant.build_fortification(self._nest, 'build_fortification_thought_done')

    def _on_ant_build_fortification_thought_done(self, ant: Ant):
        if self._nest.is_died or self._nest.fortification >= self._nest.stats.max_fortification:
            if not self._read_flag(self.Flags.IS_FINISH_STEP_STARTED):
                self._finish_step()
        else:
            self._order_ant_build_fortifications(ant)

    def _finish_step(self):
        self._write_flag(self.Flags.IS_FINISH_STEP_STARTED, True)
        self._workers_drop_picked_item()
        self._march_to_assemble_point_for_completion_step()
