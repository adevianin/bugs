from typing import List
from functools import partial
from core.world.entities.ant.base.ant import Ant
from core.world.entities.colony.colonies.ant_colony.operation.base.formation.formation_factory import FormationFactory
from core.world.entities.colony.colonies.ant_colony.operation.base.formation.base.base_formation import BaseFormation
from core.world.entities.colony.colonies.ant_colony.operation.base.operation_types import OperationTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.colony.colonies.ant_colony.operation.base.operation import Operation
from core.world.entities.nest.nest import Nest
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.colony.colonies.ant_colony.operation.base.marker_types import MarkerTypes
from .base.fight.fight_factory import FightFactory
from .base.fight.fight import Fight

class PillageNestOperation(Operation):
    
    def __init__(self, event_bus: EventEmitter, events: EventEmitter, formation_factory: FormationFactory, fight_factory: FightFactory, id: int, hired_ants: List[Ant], 
                 flags: dict, formation: BaseFormation, fight: Fight, worker_vacancies_count: int, warrior_vacancies_count: int, nest_to_pillage: Nest, nest_for_loot: Nest):
        super().__init__(event_bus, events, formation_factory, fight_factory, id, OperationTypes.PILLAGE_NEST, hired_ants, flags, formation, fight, worker_vacancies_count, warrior_vacancies_count)
        self._name = 'грабьож мурашника'
        self._open_vacancies(AntTypes.WARRIOR, self._warrior_vacancies_count)
        self._open_vacancies(AntTypes.WORKER, self._worker_vacancies_count)
        self._add_marker(MarkerTypes.PILLAGE, nest_to_pillage.position)
        self._aggression_targets_filter = lambda entity: entity.from_colony_id == self._nest_to_pillage.from_colony_id
        self._nest_to_pillage = nest_to_pillage
        self._nest_for_loot = nest_for_loot
        self._nest_to_pillage_removal_block_id = self._nest_to_pillage.block_removal()
        self._nest_for_loot_removal_block_id = self._nest_for_loot.block_removal()

    @property
    def nest_to_pillage_id(self):
        return self._nest_to_pillage.id
    
    @property
    def nest_for_loot_id(self):
        return self._nest_for_loot.id
    
    def _on_operation_stop(self):
        super()._on_operation_stop()
        self._nest_to_pillage.unblock_removal(self._nest_to_pillage_removal_block_id)
        self._nest_for_loot.unblock_removal(self._nest_for_loot_removal_block_id)
    
    def _is_aggressive_now(self):
        return self._read_flag('is_agressive')
    
    def _setup_operation(self):
        super()._setup_operation()

        self.events.add_listener('formation:march_to_nest_to_pillage:done', self._approaching_nest_to_pillage_step)
        self.events.add_listener('formation:march_to_nest_for_loot:done', self._approach_nest_for_loot_step)

        self.events.add_listener('fight_won:march_to_nest_to_pillage', self._march_to_nest_to_pillage_step)
        self.events.add_listener('fight_won:approaching_nest_to_pillage', self._approaching_nest_to_pillage_step)
        self.events.add_listener('fight_start:march_to_nest_for_loot', self._workers_drop_picked_food)
        self.events.add_listener('fight_won:march_to_nest_for_loot', self._march_to_assemble_point_to_done_operation_step)
        self.events.add_listener('fight_start:approach_nest_for_loot', self._workers_drop_picked_food)
        self.events.add_listener('fight_won:approach_nest_for_loot', self._march_to_assemble_point_to_done_operation_step)

        for ant in self._workers:
            ant.body.sayer.add_listener('worker_is_approached_nest_to_pillage', partial(self._on_worker_is_approached_nest_to_pillage, ant))
            ant.body.sayer.add_listener('worker_is_near_loot_nest', partial(self._on_worker_is_near_loot_nest, ant))
            ant.body.sayer.add_listener('ant_waited_in_nest_to_pillage', partial(self._on_ant_waited_in_nest_to_pillage, ant))
            ant.body.sayer.add_listener('ant_waited_in_loot_nest', partial(self._on_ant_waited_in_loot_nest, ant))

    def _start_operation(self):
        super()._start_operation()
        self._event_bus.emit('offensive_operation', self._hired_ants[0].from_colony_id, self._nest_to_pillage.from_colony_id)
        self._write_flag('is_agressive', False)
        self._prepare_step()

    def _on_all_ants_prepared(self):
        self._march_to_nest_to_pillage_step()

    def _march_to_nest_to_pillage_step(self):
        self._stage = 'march_to_nest_to_pillage'
        self._write_flag('is_agressive', True)
        attack_units = self._all_ants_for_march
        if self._check_is_formation_needed(attack_units, self._nest_to_pillage.position):
            formation = self._formation_factory.build_attack_formation('march_to_nest_to_pillage', attack_units, self._nest_to_pillage.position)
            self._register_formation(formation)
        else:
            self._approaching_nest_to_pillage_step()

    def _approaching_nest_to_pillage_step(self):
        self._stage = 'approaching_nest_to_pillage'
        for ant in self._warriors:
            ant.keep_clear_territory(position=self._nest_to_pillage.position, area=100)
        for ant in self._workers:
            self._write_ant_flag(ant, 'approached_nest_to_pillage', False)
            ant.walk_to(self._nest_to_pillage.position, 'worker_is_approached_nest_to_pillage')

    def _on_worker_is_approached_nest_to_pillage(self, ant: Ant):
        self._write_ant_flag(ant, 'approached_nest_to_pillage', True)
        if self._check_ant_flag_for_ants(self._workers, 'approached_nest_to_pillage'):
            self._get_in_nest_to_pillage_step()

    def _get_in_nest_to_pillage_step(self):
        if self._nest_to_pillage.is_died:
            self._march_to_assemble_point_to_done_operation_step()
            return
        
        for ant in self._workers:
            ant.get_in_nest(self._nest_to_pillage)
            self._write_ant_flag(ant, 'waited_in_nest_to_pillage', False)
            ant.wait_step(1, 'ant_waited_in_nest_to_pillage')

    def _on_ant_waited_in_nest_to_pillage(self, ant: Ant):
        self._write_ant_flag(ant, 'waited_in_nest_to_pillage', True)
        if self._check_ant_flag_for_ants(self._workers, 'waited_in_nest_to_pillage'):
            self._get_food_from_pillaging_nest_step()

    def _get_food_from_pillaging_nest_step(self):
        for ant in self._workers:
            ant.get_food_item_from_nest(self._nest_to_pillage)

        self._march_to_nest_for_loot()

    def _march_to_nest_for_loot(self):
        self._stage = 'march_to_nest_for_loot'
        units = self._all_ants_for_march
        if self._check_is_formation_needed(units, self._nest_for_loot.position):
            formation = self._formation_factory.build_attack_formation('march_to_nest_for_loot', units, self._nest_for_loot.position)
            self._register_formation(formation)
        else:
            self._approach_nest_for_loot_step()

    def _approach_nest_for_loot_step(self):
        self._stage = 'approach_nest_for_loot'
        for ant in self._workers:
            self._write_ant_flag(ant, 'near_loot_nest', False)
            ant.walk_to(self._nest_for_loot.position, 'worker_is_near_loot_nest')
        for ant in self._warriors:
            ant.keep_clear_territory(self._nest_for_loot.position, 100)

    def _on_worker_is_near_loot_nest(self, ant: Ant):
        self._write_ant_flag(ant, 'near_loot_nest', True)
        if self._check_ant_flag_for_ants(self._workers, 'near_loot_nest'):
            self._get_in_loot_nest_step()

    def _get_in_loot_nest_step(self):
        if self._nest_for_loot.is_died:
            self._workers_drop_picked_food()
            self._march_to_assemble_point_to_done_operation_step()
            return

        for ant in self._workers:
            ant.get_in_nest(self._nest_for_loot)
            self._write_ant_flag(ant, 'waited_in_loot_nest', False)
            ant.wait_step(1, 'ant_waited_in_loot_nest')

    def _on_ant_waited_in_loot_nest(self, ant: Ant):
        self._write_ant_flag(ant, 'waited_in_loot_nest', True)
        if self._check_ant_flag_for_ants(self._workers, 'waited_in_loot_nest'):
            self._give_food_to_loot_nest_step()

    def _give_food_to_loot_nest_step(self):
        for ant in self._workers:
            if ant.has_picked_item():
                ant.give_food(self._nest_for_loot)

        self._march_to_assemble_point_to_done_operation_step()
        