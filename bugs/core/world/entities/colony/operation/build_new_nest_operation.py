from core.world.utils.point import Point
from .operation import Operation
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.utils.event_emiter import EventEmitter
from .operation_types import OperationTypes
from typing import List
from core.world.entities.ant.base.ant import Ant
from core.world.entities.ant.queen.queen_ant import QueenAnt
from core.world.entities.nest.nest import Nest
from .marker_types import MarkerTypes

class BuildNewNestOperation(Operation):
    
    def __init__(self, events: EventEmitter, id: int, hired_ants: List[Ant], flags: dict, building_site: Point):
        super().__init__(events, id, OperationTypes.BUILD_NEW_NEST, hired_ants, flags)
        self._building_site = building_site
        self._name = 'новий мурашник'
        self._open_vacancies(AntTypes.WORKER, 1)
        self._open_vacancies(AntTypes.QUEEN, 1)
        self._add_marker(MarkerTypes.POINTER, self._building_site)

    @property
    def building_site(self):
        return self._building_site
    
    def _init_staff(self):
        super()._init_staff()
        
        self._worker = self.get_hired_ants(AntTypes.WORKER)[0]
        self._queen: QueenAnt = self.get_hired_ants(AntTypes.QUEEN)[0]

        self._queen.on_saying('prepared', self._on_queen_prepared)
        self._worker.on_saying('prepared', self._on_worker_prepared)

        self._queen.on_saying('arrived_to_building_site', self._on_queen_arrived_to_building_site)
        self._worker.on_saying('arrived_to_building_site', self._on_worker_arrived_to_building_site)

        self._queen.on_saying('nest_is_found', self._on_queen_found_nest)

        self._worker.on_saying('nest_is_built', self._on_nest_built)

    def _start_operation(self):
        super()._start_operation()
        self._preparation_step()

    def _preparation_step(self):
        self._worker.prepare_for_operation('prepared')
        self._queen.prepare_for_operation('prepared')

    def _on_queen_prepared(self):
        self._write_flag('is_queen_prepared', True)
        self._try_start_walk_to_building_site_step()
    
    def _on_worker_prepared(self):
        self._write_flag('is_worker_prepared', True)
        self._try_start_walk_to_building_site_step()

    def _try_start_walk_to_building_site_step(self):
        if (self._read_flag('is_queen_prepared') and self._read_flag('is_worker_prepared')):
            self._walk_to_building_site_step()

    def _walk_to_building_site_step(self):
        self._worker.walk_to(self._building_site, 'arrived_to_building_site')
        self._queen.walk_to(self._building_site, 'arrived_to_building_site')

    def _on_queen_arrived_to_building_site(self):
        self._write_flag('is_queen_arrived_to_building_site', True)
        self._try_start_building_nest_step()

    def _on_worker_arrived_to_building_site(self):
        self._write_flag('is_worker_arrived_to_building_site', True)
        self._try_start_building_nest_step()

    def _try_start_building_nest_step(self):
        if (self._read_flag('is_queen_arrived_to_building_site') and self._read_flag('is_worker_arrived_to_building_site')):
            self._building_nest_step()
    
    def _building_nest_step(self):
        self._queen.found_nest(self._building_site, sayback='nest_is_found')

    def _on_queen_found_nest(self, results):
        self._new_nest = results['nest']
        self._build_nest_step()

    def _build_nest_step(self):
        self._worker.build_nest(self._new_nest, 'nest_is_built')
        self._queen.build_nest(self._new_nest)

    def _on_nest_built(self, nest: Nest):
        self._relocate_step(nest)

    def _relocate_step(self, nest: Nest):
        self._queen.relocate_to_nest(nest)
        self._queen.get_in_nest(nest)
        self._worker.relocate_to_nest(nest)
        self._queen.leave_operation()
        self._worker.leave_operation()
        self._mark_as_done()
