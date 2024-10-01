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
from core.world.entities.ant.warrior.warrior_ant import WarriorAnt
from core.world.entities.ant.worker.worker_ant import WorkerAnt
from .base.fight.fight_factory import FightFactory
from .base.fight.fight import Fight

class PillageNestOperation(Operation):
    
    def __init__(self, event_bus: EventEmitter, events: EventEmitter, formation_factory: FormationFactory, fight_factory: FightFactory, id: int, hired_ants: List[Ant], 
                 flags: dict, formation: BaseFormation, fight: Fight, nest_to_pillage: Nest, nest_for_loot: Nest, workers_count: int, warriors_count: int):
        self._nest_to_pillage = nest_to_pillage
        self._nest_for_loot = nest_for_loot
        self._workers_count = workers_count
        self._warriors_count = warriors_count
        super().__init__(event_bus, events, formation_factory, fight_factory, id, OperationTypes.PILLAGE_NEST, hired_ants, flags, formation, fight)
        self._name = 'грабьож мурашника'
        self._open_vacancies(AntTypes.WARRIOR, self._warriors_count)
        self._open_vacancies(AntTypes.WORKER, self._workers_count)
        self._add_marker(MarkerTypes.PILLAGE, nest_to_pillage.position)

        self._aggression_targets_filter = lambda entity: entity.from_colony_id == self._nest_to_pillage.from_colony_id

        self.events.add_listener('formation:march_to_nest_to_pillage:done', self._approaching_nest_to_pillage_step)
        self.events.add_listener('formation:march_to_nest_for_loot:done', self._approach_nest_for_loot_step)

        self.events.add_listener('fight_won:preparing', self._prepare_step)
        self.events.add_listener('fight_won:march_to_nest_to_pillage', self._march_to_nest_to_pillage_step)
        self.events.add_listener('fight_won:approaching_nest_to_pillage', self._approaching_nest_to_pillage_step)
        self.events.add_listener('fight_start:march_to_nest_for_loot', self._drop_picked_food)
        self.events.add_listener('fight_won:march_to_nest_for_loot', self._march_to_nest_for_loot)
        self.events.add_listener('fight_start:approach_nest_for_loot', self._drop_picked_food)
        self.events.add_listener('fight_won:approach_nest_for_loot', self.cancel)

    @property
    def nest_to_pillage_id(self):
        return self._nest_to_pillage.id
    
    @property
    def nest_for_loot_id(self):
        return self._nest_for_loot.id
    
    @property
    def workers_count(self):
        return self._workers_count
    
    @property
    def warriors_count(self):
        return self._warriors_count

    @property
    def _warriors(self) -> List[WarriorAnt]:
        return self.get_hired_ants(AntTypes.WARRIOR)
    
    @property
    def _workers(self) -> List[WorkerAnt]:
        return self.get_hired_ants(AntTypes.WORKER)
    
    def _is_aggressive_now(self):
        return self._read_flag('is_agressive')
    
    def _setup_operation(self):
        super()._setup_operation()

        for ant in self._workers:
            ant.body.sayer.add_listener('worker_is_approached_nest_to_pillage', partial(self._on_worker_is_approached_nest_to_pillage, ant))
            ant.body.sayer.add_listener('worker_waited_in_nest_to_pillage', partial(self._on_worker_waited_in_nest_to_pillage, ant))
            ant.body.sayer.add_listener('worker_is_near_loot_nest', partial(self._on_worker_is_near_loot_nest, ant))

        for ant in self._hired_ants:
            ant.body.sayer.add_listener('prepared', partial(self._on_ant_prepared, ant))

    def _start_operation(self):
        super()._start_operation()
        self._prepare_step()

    def _prepare_step(self):
        self._stage = 'preparing'

        self._write_flag('is_agressive', False)
        for ant in self._hired_ants:
            self._write_flag(f'ant_{ant.id}_prepared', False)
            ant.prepare_for_operation(self._assemble_point, 'prepared')

    def _on_ant_prepared(self, ant: Ant):
        self._write_flag(f'ant_{ant.id}_prepared', True)
        if self._check_are_all_ants_prepared():
            self._march_to_nest_to_pillage_step()

    def _check_are_all_ants_prepared(self):
        for ant in self._hired_ants:
            if not self._read_flag(f'ant_{ant.id}_prepared'):
                return False
        return True
    
    def _march_to_nest_to_pillage_step(self):
        self._stage = 'march_to_nest_to_pillage'
        self._write_flag('is_agressive', True)
        attack_units = self._warriors + self._workers
        formation = self._formation_factory.build_attack_formation('march_to_nest_to_pillage', attack_units, self._nest_to_pillage.position)
        self._register_formation(formation)

    def _approaching_nest_to_pillage_step(self):
        self._stage = 'approaching_nest_to_pillage'
        for ant in self._warriors:
            ant.keep_clear_territory(position=self._nest_to_pillage.position, area=100)
        for ant in self._workers:
            ant.walk_to(self._nest_to_pillage.position, 'worker_is_approached_nest_to_pillage')

    def _on_worker_is_approached_nest_to_pillage(self, ant: Ant):
        ant.get_in_nest(self._nest_to_pillage)
        self._write_flag(f'is_worker_{ant.id}_waited_in_nest_to_pillage', False)
        ant.wait_step(1, 'worker_waited_in_nest_to_pillage')

    def _on_worker_waited_in_nest_to_pillage(self, ant: Ant):
        self._write_flag(f'is_worker_{ant.id}_waited_in_nest_to_pillage', True)
        if self._check_are_all_workers_waited_in_nest_to_pillage():
            self._get_food_from_pillaging_nest_step()

    def _check_are_all_workers_waited_in_nest_to_pillage(self):
        for ant in self._workers:
            if not self._read_flag(f'is_worker_{ant.id}_waited_in_nest_to_pillage'):
                return False
        return True
    
    def _get_food_from_pillaging_nest_step(self):
        for ant in self._workers:
            ant.get_food_item_from_nest(self._nest_to_pillage)
            ant.get_out_of_nest()
        for ant in self._warriors:
            ant.free_mind()

        self._march_to_nest_for_loot()

    def _march_to_nest_for_loot(self):
        self._stage = 'march_to_nest_for_loot'
        # self._write_flag('is_agressive', False)
        units = self._warriors + self._workers
        formation = self._formation_factory.build_attack_formation('march_to_nest_for_loot', units, self._nest_for_loot.position)
        self._register_formation(formation)

    def _approach_nest_for_loot_step(self):
        self._stage = 'approach_nest_for_loot'
        for ant in self._workers:
            self._write_flag(f'is_worker_{ant.id}_near_loot_nest', False)
            ant.walk_to(self._nest_for_loot.position, 'worker_is_near_loot_nest')
        for ant in self._warriors:
            ant.keep_clear_territory(self._nest_for_loot.position, 100)

    def _on_worker_is_near_loot_nest(self, ant: Ant):
        self._write_flag(f'is_worker_{ant.id}_near_loot_nest', True)
        if self._check_are_all_workers_near_loot_nest():
            self._give_food_to_loot_nest_step()

    def _check_are_all_workers_near_loot_nest(self):
        for ant in self._workers:
            if not self._read_flag(f'is_worker_{ant.id}_near_loot_nest'):
                return False
        return True
    
    def _give_food_to_loot_nest_step(self):
        for ant in self._workers:
            if ant.has_picked_item():
                ant.get_in_nest(self._nest_for_loot)
                ant.give_food(self._nest_for_loot)
        
        self.done()

    def _drop_picked_food(self):
        for ant in self._workers:
            if ant.has_picked_item():
                ant.drop_picked_item()
    