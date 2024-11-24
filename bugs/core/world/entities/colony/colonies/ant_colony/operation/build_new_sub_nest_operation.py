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

from typing import List
from functools import partial

class BuildNewSubNestOperation(Operation):
    
    def __init__(self, event_bus: EventEmitter, events: EventEmitter, formation_factory: FormationFactory, fight_factory: FightFactory, id: int, hired_ants: List[Ant], flags: dict, 
                 formation: BaseFormation, fight: Fight, building_site: Point, workers_count: int, building_nest: Nest = None):
        super().__init__(event_bus, events, formation_factory, fight_factory, id, OperationTypes.BUILD_NEW_SUB_NEST, hired_ants, flags, formation, fight)
        self._building_site = building_site
        self._building_nest = building_nest
        self._workers_count = workers_count
        self._name = 'новий мурашник'
        self._open_vacancies(AntTypes.WORKER, self._workers_count, [GenesTypes.BUILDING_SUBNEST])
        self._add_marker(MarkerTypes.POINTER, self._building_site)

        self.events.add_listener('formation:march_to_building_site:done', self._on_formation_march_to_building_site_done)
        self.events.add_listener('formation:march_to_assemble_point_to_stop_operation:done', self.done)

        self.events.add_listener('fight_won:preparing', self._prepare_step)
        self.events.add_listener('fight_won:march_to_building_site', self._march_to_building_site_step)
        self.events.add_listener('fight_won:approach_building_site', self._approach_building_site_step)
        self.events.add_listener('fight_won:building_nest', self._approach_building_site_step)
        self.events.add_listener('fight_won:march_to_assemble_point', self._march_to_assemble_point_to_stop_operation_step)

    @property
    def building_site(self):
        return self._building_site
    
    @property
    def building_nest_id(self):
        return self._building_nest.id if self._building_nest else None
    
    @property
    def workers_count(self):
        return self._workers_count
    
    def _setup_operation(self):
        super()._setup_operation()

        self._workers = self.get_hired_ants(AntTypes.WORKER)

        for worker in self._workers:
            worker.sayer.add_listener('prepared', partial(self._on_worker_prepared, worker))
            worker.sayer.add_listener('approached_building_site', partial(self._on_worker_approached_building_site, worker))
            worker.sayer.add_listener('nest_is_built', self._on_nest_built)
            
    def _start_operation(self):
        super()._start_operation()
        self._prepare_step()
    
    def _prepare_step(self):
        self._stage = 'preparing'
        for worker in self._workers:
            self._write_flag(f'worker_{worker.id}_prepared', False)
            worker.prepare_for_operation(self._assemble_point, 'prepared')

    def _on_worker_prepared(self, worker: WorkerAnt):
        self._write_flag(f'worker_{worker.id}_prepared', True)
        if self._check_are_all_workers_prepared():
            self._march_to_building_site_step()

    def _check_are_all_workers_prepared(self):
        for worker in self._workers:
            if not self._read_flag(f'worker_{worker.id}_prepared'):
                return False
        return True

    def _march_to_building_site_step(self):
        self._stage = 'march_to_building_site'
        formation = self._formation_factory.build_convoy_formation('march_to_building_site', self._workers, self._building_site)
        self._register_formation(formation)

    def _on_formation_march_to_building_site_done(self):
        self._approach_building_site_step()

    def _approach_building_site_step(self):
        self._stage = 'approach_building_site'
        for worker in self._workers:
            self._write_flag(f'worker_{worker.id}_approached_to_building_site', False)
            worker.walk_to(self._building_site, 'approached_building_site')

    def _on_worker_approached_building_site(self, worker: WorkerAnt):
        self._write_flag(f'worker_{worker.id}_approached_to_building_site', True)
        if self._check_are_all_workers_approached_to_building_site():
            self._found_nest_step()
    
    def _check_are_all_workers_approached_to_building_site(self):
        for worker in self._workers:
            if not self._read_flag(f'worker_{worker.id}_approached_to_building_site'):
                return False
        return True

    def _found_nest_step(self):
        if not self._building_nest: #for repeating step
            self._workers[0].found_nest(self._building_site, self._on_nest_found)
        else:
            self._on_nest_found(self._building_nest)
    
    def _on_nest_found(self, nest: Nest):
        self._building_nest = nest
        self._build_nest_step()

    def _build_nest_step(self):
        self._stage = 'building_nest'
        for worker in self._workers:
            worker.build_nest(self._building_nest, False, 'nest_is_built')

    def _on_nest_built(self):
        if not self._read_flag(f'finalization_step_started'):
            self._finalization_step()

    def _finalization_step(self):
        self._write_flag(f'finalization_step_started', True)
        self._building_nest.take_calories(500)
        self._march_to_assemble_point_to_stop_operation_step()

    def _march_to_assemble_point_to_stop_operation_step(self):
        self._stage = 'march_to_assemble_point'
        if BaseFormation.check_is_formation_needed(self._workers, self._assemble_point):
            formation = self._formation_factory.build_convoy_formation('march_to_assemble_point_to_stop_operation', self._workers, self._assemble_point)
            self._register_formation(formation)
        else:
            self.done()
