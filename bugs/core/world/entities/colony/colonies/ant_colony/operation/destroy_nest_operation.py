from typing import List
from core.world.entities.ant.base.ant import Ant
from core.world.entities.colony.colonies.ant_colony.operation.base.operation_types import OperationTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.colony.colonies.ant_colony.operation.base.operation import Operation
from core.world.entities.nest.nest import Nest
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.colony.colonies.ant_colony.operation.base.marker_types import MarkerTypes
from core.world.entities.colony.colonies.ant_colony.operation.base.formation.formation_factory import FormationFactory
from core.world.entities.colony.colonies.ant_colony.operation.base.formation.base.base_formation import BaseFormation
from .base.fight.fight_factory import FightFactory
from .base.fight.fight import Fight

class DestroyNestOperation(Operation):

    class Flags(Operation.Flags):
        pass

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, formation_factory: FormationFactory, fight_factory: FightFactory, id: int, hired_ants: List[Ant],
                  flags: dict, formation: BaseFormation, fight: Fight, worker_vacancies_count: int, warrior_vacancies_count: int, nest: Nest):
        super().__init__(event_bus, events, formation_factory, fight_factory, id, OperationTypes.DESTROY_NEST, hired_ants, flags, formation, fight, worker_vacancies_count, warrior_vacancies_count)
        self._name = 'знищення мурашника'
        self._open_vacancies(AntTypes.WARRIOR, self._warrior_vacancies_count)
        self._open_vacancies(AntTypes.WORKER, self._worker_vacancies_count)
        self._add_marker(MarkerTypes.CROSS, nest.position)

        self._aggression_targets_filter = lambda entity: entity.from_colony_id == self._nest.from_colony_id

        self._nest = nest
        self._nest_removel_block_id = self._nest.block_removal()

    @property
    def nest_id(self):
        return self._nest.id
    
    def _on_operation_stop(self):
        super()._on_operation_stop()
        self._nest.unblock_removal(self._nest_removel_block_id)
    
    def _setup_operation(self):
        super()._setup_operation()

        self.events.add_listener('formation:march_to_nest_to_destroy:done', self._destroy_step)

        self.events.add_listener('fight_won:march_to_nest_to_destroy', self._march_to_nest_to_destroy_step)
        self.events.add_listener('fight_won:destroying', self._destroy_step)

        for ant in self._hired_ants:
            ant.body.sayer.add_listener('nest_destroyed', self._on_nest_destroyed)
    
    def _start_operation(self):
        super()._start_operation()
        self._event_bus.emit('offensive_operation', self._hired_ants[0].from_colony_id, self._nest.from_colony_id)
        self._prepare_step()

    def _on_all_ants_prepared(self):
        self._march_to_nest_to_destroy_step()
    
    def _march_to_nest_to_destroy_step(self):
        self._stage = 'march_to_nest_to_destroy'
        self._write_flag(self.Flags.IS_AGGRESSIVE, True)
        units = self._all_ants_for_march
        if self._check_is_formation_needed(units, self._nest.position):
            formation = self._formation_factory.build_attack_formation('march_to_nest_to_destroy', units, self._nest.position)
            self._register_formation(formation)
        else:
            self._destroy_step()

    def _destroy_step(self):
        self._stage = 'destroying'
        
        if self._nest.is_died:
            self._on_nest_destroyed()
            return

        for ant in self._hired_ants:
            ant.attack_nest(nest=self._nest, sayback='nest_destroyed')

    def _on_nest_destroyed(self):
        if self._stage != 'go_back_home':
            self._go_back_home_step()

    def _go_back_home_step(self):
        self._stage = 'go_back_home'
        self._write_flag(self.Flags.IS_AGGRESSIVE, False)
        self._march_to_assemble_point_for_completion_step()
