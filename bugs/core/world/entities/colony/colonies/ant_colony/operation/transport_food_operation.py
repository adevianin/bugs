from core.world.entities.colony.colonies.ant_colony.operation.base.operation import Operation
from core.world.entities.colony.colonies.ant_colony.operation.base.operation_types import OperationTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.colony.colonies.ant_colony.formation.formation_factory import FormationFactory
from core.world.entities.colony.colonies.ant_colony.formation.base.base_formation import BaseFormation
from core.world.entities.ant.base.ant import Ant
from core.world.entities.ant.worker.worker_ant import WorkerAnt
from core.world.entities.ant.warrior.warrior_ant import WarriorAnt
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.nest.nest import Nest
from core.world.entities.colony.colonies.ant_colony.operation.base.marker_types import MarkerTypes

# from core.world.my_test_env import MY_TEST_ENV

from typing import List
from functools import partial

class TransportFoodOperation(Operation):

    def __init__(self, events: EventEmitter, formation_factory: FormationFactory, id: int, hired_ants: List[Ant], flags: dict, formations: List[BaseFormation], nest_from: Nest, nest_to: Nest, workers_count: int, warriors_count: int):
        super().__init__(events, formation_factory, id, OperationTypes.TRANSPORT_FOOD, hired_ants, flags, formations)
        self._nest_from = nest_from
        self._nest_to = nest_to
        self._workers_count = workers_count
        self._warriors_count = warriors_count
        self._name = 'перенести їжу'
        self._open_vacancies(AntTypes.WORKER, workers_count)
        self._open_vacancies(AntTypes.WARRIOR, warriors_count)
        self._add_marker(MarkerTypes.EAT, self._nest_from.position)
        self._add_marker(MarkerTypes.EAT, self._nest_to.position)

        self.events.add_listener('formation:go_to_nest_from:reached_destination', self._on_formation_reached_nest_from)
        self.events.add_listener('formation:go_to_nest_to:reached_destination', self._on_formation_reached_nest_to)
        self.events.add_listener('formation:go_to_nest_to:before_fighting', self._on_before_fight_on_go_to_nest_to)
        self.events.add_listener('formation:go_to_nest_to:before_walking', self._on_before_walking_on_go_to_nest_to)

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
    
    def _init_staff(self):
        super()._init_staff()

        for ant in self._hired_ants:
            ant.body.sayer.add_listener('prepared', partial(self._on_ant_prepared, ant))

        for ant in self._workers: 
            ant.body.sayer.add_listener('worker_is_near_nest_from', partial(self._on_worker_near_nest_from, ant))
            ant.body.sayer.add_listener('worker_got_food', partial(self._on_worker_got_food, ant))
            ant.body.sayer.add_listener('worker_is_near_nest_to', partial(self._on_worker_near_nest_to, ant))

    def _start_operation(self):
        super()._start_operation()
        self._prepare_step()

    def _prepare_step(self):
        for ant in self._hired_ants:
            ant.prepare_for_operation('prepared')

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
        formation = self._formation_factory.build_convoy_formation('go_to_nest_from', self._warriors + self._workers, self._nest_from.position)
        self._register_formation(formation)

    def _on_formation_reached_nest_from(self):
        for ant in self._workers:
            ant.walk_to(self._nest_from.position, 'worker_is_near_nest_from')

        for ant in self._warriors:
            ant.keep_clear_territory(self._nest_from.position, 100)

    def _on_worker_near_nest_from(self, ant: Ant):
        ant.get_in_nest(self._nest_from)
        ant.get_food_item_from_nest(self._nest_from)
        ant.wait_step(1, 'worker_got_food')

    def _on_worker_got_food(self, ant: Ant):
        self._write_flag(f'is_worker_{ant.id}_got_food', True)
        if self._check_are_all_workers_got_food():
            self._go_to_nest_to()

    def _check_are_all_workers_got_food(self):
        for ant in self._workers:
            if not self._read_flag(f'is_worker_{ant.id}_got_food'):
                return False
        return True

    def _go_to_nest_to(self):
        for ant in self._workers:
            ant.get_out_of_nest()
        
        for ant in self._warriors:
            ant.free_mind()

        formation = self._formation_factory.build_convoy_formation('go_to_nest_to', self._warriors + self._workers, self._nest_to.position)
        self._register_formation(formation)

        # MY_TEST_ENV['attacker'].fight_enemy(self._warriors[0])

    def _on_formation_reached_nest_to(self):
        for ant in self._workers:
            ant.walk_to(self._nest_to.position, 'worker_is_near_nest_to')

        for ant in self._warriors:
            ant.keep_clear_territory(self._nest_to.position, 100)

    def _on_worker_near_nest_to(self, ant: Ant):
        if ant.has_picked_item():
            ant.get_in_nest(self._nest_to)
            ant.give_food(self._nest_to)
        self._write_flag(f'is_worker_{ant.id}_gave_food', True)

        if self._check_are_all_worker_gave_food():
            self.done()

    def _check_are_all_worker_gave_food(self):
        for ant in self._workers:
            if not self._read_flag(f'is_worker_{ant.id}_gave_food'):
                return False
        return True
    
    def _on_before_fight_on_go_to_nest_to(self):
        for ant in self._workers:
            if ant.has_picked_item():
                ant.stash_picked_item()

    def _on_before_walking_on_go_to_nest_to(self):
        for ant in self._workers:
            if ant.has_stashed_item():
                ant.get_stashed_item_back()