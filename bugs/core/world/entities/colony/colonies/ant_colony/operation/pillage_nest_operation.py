from typing import List
from functools import partial
from core.world.entities.ant.base.ant import Ant
from core.world.entities.colony.colonies.ant_colony.formation.formation_factory import FormationFactory
from core.world.entities.colony.colonies.ant_colony.operation.base.operation_types import OperationTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.colony.colonies.ant_colony.operation.base.operation import Operation
from core.world.entities.nest.nest import Nest
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.colony.colonies.ant_colony.operation.base.marker_types import MarkerTypes
from core.world.entities.ant.warrior.warrior_ant import WarriorAnt
from core.world.entities.ant.worker.worker_ant import WorkerAnt
from core.world.entities.ant.warrior.warrior_ant_body import WarriorAntBody
from core.world.entities.item.items.base.item import Item

class PillageNestOperation(Operation):
    
    def __init__(self, events: EventEmitter, formation_factory: FormationFactory, id: int, hired_ants: List[Ant], flags: dict, nest_to_pillage: Nest, nest_to_unload: Nest):
        self._nest_to_pillage = nest_to_pillage
        self._nest_to_unload = nest_to_unload
        super().__init__(events, formation_factory, id, OperationTypes.PILLAGE_NEST, hired_ants, flags)
        self._name = 'грабьож мурашника'
        self._open_vacancies(AntTypes.WARRIOR, 5)
        self._open_vacancies(AntTypes.WORKER, 2)
        self._add_marker(MarkerTypes.PILLAGE, nest_to_pillage.position)

    @property
    def nest_to_pillage_id(self):
        return self._nest_to_pillage.id
    
    @property
    def nest_to_unload_id(self):
        return self._nest_to_unload.id
    
    @property
    def _warriors(self) -> List[WarriorAnt]:
        return self.get_hired_ants(AntTypes.WARRIOR)
    
    @property
    def _workers(self) -> List[WorkerAnt]:
        return self.get_hired_ants(AntTypes.WORKER)
    
    def _init_staff(self):
        super()._init_staff()
        attack_formation = self._formation_factory.build_attack_formation(self._nest_to_pillage.position, WarriorAntBody.DISTANCE_PER_SEP)
        self._register_formation(attack_formation)
        self._go_home_formation = self._formation_factory.build_attack_formation(self._nest_to_unload.position, WarriorAntBody.DISTANCE_PER_SEP, self._nest_to_pillage.position)
        self._register_formation(self._go_home_formation)

        attack_formation.events.add_listener('reached_destination', self._pillage_step)
        self._go_home_formation.events.add_listener('reached_destination', self._on_ants_got_home)

        for ant in self._warriors:
            ant.set_formation(attack_formation)
        for ant in self._workers:
            ant.set_formation(attack_formation)
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
        for ant in self._hired_ants:
            ant.walk_in_formation(is_attacking_enemies=True)

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
            ant.set_formation(self._go_home_formation)
            ant.walk_in_formation(is_attacking_enemies=False)
        for ant in self._warriors:
            ant.free_mind()
            ant.set_formation(self._go_home_formation)
            ant.walk_in_formation(is_attacking_enemies=True)

    def _on_ants_got_home(self):
        for ant in self._workers:
            ant.walk_to(self._nest_to_unload.position, 'worker_is_at_home')

    def _on_worker_is_at_home(self, ant: Ant):
        self._write_flag(f'is_worker_{ant.id}_gave_food', True)
        ant.get_in_nest(self._nest_to_unload)
        ant.give_food(self._nest_to_unload)

        if self._check_are_all_worker_gave_food():
            self.done()

    def _check_are_all_worker_gave_food(self):
        for ant in self._workers:
            if not self._read_flag(f'is_worker_{ant.id}_gave_food'):
                return False
        return True

    
            
        
            
        
    