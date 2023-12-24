from typing import List
from functools import partial
from core.world.entities.ant.base.ant import Ant
from core.world.entities.colony.colonies.ant_colony.formation.base.formation_manager import FormationManager
from core.world.entities.colony.colonies.ant_colony.operation.base.operation_types import OperationTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.colony.colonies.ant_colony.operation.base.operation import Operation
from core.world.entities.nest.nest import Nest
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.colony.colonies.ant_colony.operation.base.marker_types import MarkerTypes
from core.world.entities.ant.warrior.warrior_ant import WarriorAnt
from core.world.entities.ant.worker.worker_ant import WorkerAnt
from core.world.entities.item.items.base.item import Item
from core.world.entities.colony.colonies.ant_colony.formation.attack_formation import AttackFormation

class PillageNestOperation(Operation):
    
    def __init__(self, events: EventEmitter, formation_manager: FormationManager, id: int, hired_ants: List[Ant], flags: dict, nest_to_pillage: Nest, nest_for_loot: Nest, workers_count: int, warriors_count: int, attack_formation: AttackFormation = None, go_home_formation: AttackFormation = None):
        self._nest_to_pillage = nest_to_pillage
        self._nest_for_loot = nest_for_loot
        self._attack_formation = attack_formation
        self._go_home_formation = go_home_formation
        self._workers_count = workers_count
        self._warriors_count = warriors_count
        super().__init__(events, formation_manager, id, OperationTypes.PILLAGE_NEST, hired_ants, flags)
        self._name = 'грабьож мурашника'
        self._open_vacancies(AntTypes.WARRIOR, self._warriors_count)
        self._open_vacancies(AntTypes.WORKER, self._workers_count)
        self._add_marker(MarkerTypes.PILLAGE, nest_to_pillage.position)

    @property
    def nest_to_pillage_id(self):
        return self._nest_to_pillage.id
    
    @property
    def nest_for_loot_id(self):
        return self._nest_for_loot.id
    
    @property
    def attack_formation(self) -> AttackFormation:
        return self._attack_formation
    
    @property
    def go_home_formation(self) -> AttackFormation:
        return self._go_home_formation
    
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
    
    def _init_staff(self):
        super()._init_staff()

        attack_units = self._warriors + self._workers
        
        self._attack_formation = self._attack_formation or self._formation_manager.prepare_attack_formation(attack_units, self._nest_to_pillage.position)
        self._attack_formation.events.add_listener('reached_destination', self._pillage_step)

        self._go_home_formation = self._go_home_formation or self._formation_manager.prepare_attack_formation(attack_units, self._nest_for_loot.position)
        self._go_home_formation.events.add_listener('reached_destination', self._on_ants_got_home)

        for ant in self._workers:
            ant.body.sayer.add_listener('worker_is_near_nest', partial(self._on_worker_near_nest, ant))
            ant.body.sayer.add_listener('worker_is_ready_for_load', partial(self._on_worker_is_ready_for_load, ant))
            ant.body.sayer.add_listener('worker_is_at_home', partial(self._on_worker_is_at_home, ant))

        for ant in self._hired_ants:
            ant.body.sayer.add_listener('prepared', partial(self._on_ant_prepared, ant))

    def _start_operation(self):
        super()._start_operation()
        self._prepare_step()

    def _prepare_step(self):
        for ant in self._hired_ants:
            ant.prepare_for_operation('prepared')

    def _on_ant_prepared(self, ant: Ant):
        self._write_flag(f'ant_{ant.id}_prepared', True)
        if self._check_are_all_ants_prepared():
            self._attack_step()

    def _check_are_all_ants_prepared(self):
        for ant in self._hired_ants:
            if not self._read_flag(f'ant_{ant.id}_prepared'):
                return False
        return True
    
    def _attack_step(self):
        self._attack_formation.activate()

    def _pillage_step(self):
        for ant in self._warriors:
            ant.keep_clear_territory(position=self._nest_to_pillage.position, area=100)
        for ant in self._workers:
            ant.walk_to(self._nest_to_pillage.position, 'worker_is_near_nest')

    def _on_worker_near_nest(self, ant: Ant):
        def on_food_ready(ant_food: Item):
            ant.pick_up_item(ant_food)

        ant.get_in_nest(self._nest_to_pillage)
        is_there_food = self._nest_to_pillage.steal_food(on_food_ready)
        ant.wait_step(1, 'worker_is_ready_for_load')

    def _on_worker_is_ready_for_load(self, ant: Ant):
        self._write_flag(f'is_worker_{ant.id}_ready_for_go_home', True)
        if self._check_are_all_workers_ready_for_go_home():
            self._go_home_step()

    def _check_are_all_workers_ready_for_go_home(self):
        for ant in self._workers:
            if not self._read_flag(f'is_worker_{ant.id}_ready_for_go_home'):
                return False
        return True
    
    def _go_home_step(self):
        for ant in self._workers:
            ant.get_out_of_nest()
        for ant in self._warriors:
            ant.free_mind()

        self._go_home_formation.activate()

    def _on_ants_got_home(self):
        for ant in self._workers:
            ant.walk_to(self._nest_for_loot.position, 'worker_is_at_home')

    def _on_worker_is_at_home(self, ant: Ant):
        self._write_flag(f'is_worker_{ant.id}_gave_food', True)
        ant.get_in_nest(self._nest_for_loot)
        ant.give_food(self._nest_for_loot)

        if self._check_are_all_worker_gave_food():
            self.done()

    def _check_are_all_worker_gave_food(self):
        for ant in self._workers:
            if not self._read_flag(f'is_worker_{ant.id}_gave_food'):
                return False
        return True

    
            
        
            
        
    