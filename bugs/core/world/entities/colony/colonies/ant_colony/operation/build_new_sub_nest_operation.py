from core.world.utils.point import Point
from core.world.entities.colony.colonies.ant_colony.operation.base.operation import Operation
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.colony.colonies.ant_colony.operation.base.operation_types import OperationTypes
from core.world.entities.ant.base.ant import Ant
from core.world.entities.ant.worker.worker_ant import WorkerAnt
from core.world.entities.nest.nest import Nest
from core.world.entities.colony.colonies.ant_colony.operation.base.marker_types import MarkerTypes
from core.world.entities.colony.colonies.ant_colony.operation.base.formation.formation_factory import FormationFactory
from core.world.entities.ant.base.genetic.genes.base.genes_types import GenesTypes
from core.world.entities.colony.colonies.ant_colony.operation.base.formation.base.base_formation import BaseFormation
from .base.fight.fight_factory import FightFactory
from .base.fight.fight import Fight
from core.world.settings import NEST_BLOCKING_RADIUS

from typing import List
from functools import partial

class BuildNewSubNestOperation(Operation):

    MIN_WORKERS_COUNT = 1

    class Flags(Operation.Flags):
        ANT_FLAG_APPROACHED_BUILDING_SITE = 'approached_to_building_site'
        ANT_FLAG_FINISHED_BUILDING_NEST = 'finished_building_nest'
    
    def __init__(self, event_bus: EventEmitter, events: EventEmitter, formation_factory: FormationFactory, fight_factory: FightFactory, id: int, hired_ants: List[Ant], flags: dict, 
                 formation: BaseFormation, fight: Fight, worker_vacancies_count: int, warrior_vacancies_count: int, nest_name: str, building_site: Point, building_nest: Nest = None):
        super().__init__(event_bus, events, formation_factory, fight_factory, id, OperationTypes.BUILD_NEW_SUB_NEST, hired_ants, flags, formation, fight, worker_vacancies_count, warrior_vacancies_count)
        self._nest_name = nest_name
        self._building_site = building_site
        self._building_nest = building_nest
        self._name = f'новий під мурашник "{self._nest_name}"'
        # self._open_vacancies(AntTypes.WORKER, self._worker_vacancies_count)
        self._open_vacancies(AntTypes.WORKER, self._worker_vacancies_count, [GenesTypes.SPECIALIZATION_BUILDING_SUBNEST])
        self._open_vacancies(AntTypes.WARRIOR, self._warrior_vacancies_count)
        self._add_marker(MarkerTypes.POINTER, self._building_site)

    @property
    def nest_name(self):
        return self._nest_name
    
    @property
    def building_site(self):
        return self._building_site
    
    @property
    def building_nest_id(self):
        return self._building_nest.id if self._building_nest else None
    
    def _setup_operation(self):
        super()._setup_operation()

        self.events.add_listener('formation:march_to_building_site:done', self._approach_building_site_step)

        self.events.add_listener('fight_won:march_to_building_site', self._march_to_building_site_step)
        self.events.add_listener('fight_won:approach_building_site', self._approach_building_site_step)
        self.events.add_listener('fight_won:building_nest', self._approach_building_site_step)

        self.events.add_listener('hired_ant_died', self._on_ant_died)

        for worker in self._workers:
            worker.sayer.add_listener('approached_building_site', partial(self._on_worker_approached_building_site, worker))
            worker.sayer.add_listener('nest_is_built', partial(self._on_nest_built, worker))
            
    def _start_operation(self):
        super()._start_operation()
        self._prepare_step()
    
    def _on_all_ants_prepared(self):
        self._march_to_building_site_step()

    def _march_to_building_site_step(self):
        self._stage = 'march_to_building_site'
        units = self._all_ants_for_march
        if self._check_is_formation_needed(units, self._building_site):
            formation = self._formation_factory.build_convoy_formation('march_to_building_site', units, self._building_site)
            self._register_formation(formation)
        else:
            self._approach_building_site_step()

    def _approach_building_site_step(self):
        self._stage = 'approach_building_site'
        for worker in self._workers:
            self._write_ant_flag(worker, self.Flags.ANT_FLAG_APPROACHED_BUILDING_SITE, False)
            worker.walk_to(self._building_site, 'approached_building_site')
        for warrior in self._warriors:
            warrior.keep_clear_territory(self._building_site, 100)

    def _on_worker_approached_building_site(self, worker: WorkerAnt):
        self._write_ant_flag(worker, self.Flags.ANT_FLAG_APPROACHED_BUILDING_SITE, True)
        if self._check_ant_flag_for_ants(self._workers, self.Flags.ANT_FLAG_APPROACHED_BUILDING_SITE):
            self._found_nest_step()
    
    def _found_nest_step(self):
        if not self._building_nest or self._building_nest.is_died: #for repeating step
            nests = self._workers[0].look_around_for_nests()
            if len(nests) == 0 or nests[0].position.dist(self._workers[0].position) > NEST_BLOCKING_RADIUS:
                self._workers[0].found_nest(self._nest_name, False, self._building_site, self._on_nest_found)
            else:
                self._march_to_assemble_point_for_completion_step()
        else:
            self._build_nest_step()
    
    def _on_nest_found(self, nest: Nest):
        self._building_nest = nest
        self._build_nest_step()

    def _build_nest_step(self):
        self._stage = 'building_nest'
        for worker in self._workers:
            self._write_ant_flag(worker, self.Flags.ANT_FLAG_FINISHED_BUILDING_NEST, False)
            worker.build_nest(self._building_nest, False, 'nest_is_built')

    def _on_nest_built(self, worker: Ant, is_built: bool):
        self._write_ant_flag(worker, self.Flags.ANT_FLAG_FINISHED_BUILDING_NEST, True)
        if self._check_ant_flag_for_ants(self._workers, self.Flags.ANT_FLAG_FINISHED_BUILDING_NEST):
            self._march_to_assemble_point_for_completion_step()

    def _on_ant_died(self, ant: Ant):
        if len(self._workers) == 0:
            self._march_to_assemble_point_for_completion_step()
