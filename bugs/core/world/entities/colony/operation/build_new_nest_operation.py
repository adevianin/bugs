from core.world.utils.point import Point
from core.world.entities.nest.nest_factory import NestFactory
from .operation import Operation
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.utils.event_emiter import EventEmitter
from .operation_types import OperationTypes
from typing import List
from core.world.entities.ant.base.ant import Ant

class BuildNewNestOperation(Operation):
    
    def __init__(self, events: EventEmitter, id: int, hired_ants: List[Ant], flags: dict, building_site: Point, nest_factory: NestFactory):
        super().__init__(events, id, OperationTypes.BUILD_NEW_NEST, hired_ants, flags)
        self._building_site = building_site
        self._nest_factory = nest_factory
        self._name = 'новий мурашник'
        self._open_vacancies(AntTypes.WORKER, 1)
        self._open_vacancies(AntTypes.QUEEN, 1)
        self._add_pointer_marker(self._building_site)

    @property
    def building_site(self):
        return self._building_site
    
    def _reset_flags(self):
        self._flags.update({
            'is_queen_prepared': False,
            'is_worker_prepared': False,
            'is_queen_arrived_to_building_site': False,
            'is_worker_arrived_to_building_site': False,
            'is_nest_built': False
        })

    def _init_staff_connection(self):
        self._worker = self.get_hired_ants(AntTypes.WORKER)[0]
        self._queen = self.get_hired_ants(AntTypes.QUEEN)[0]

        self._queen.events.once('say:prepared', self._on_queen_prepared)
        self._worker.events.once('say:prepared', self._on_worker_prepared)

        self._queen.events.once('say:arrived_to_building_site', self._on_queen_arrived_to_building_site)
        self._worker.events.once('say:arrived_to_building_site', self._on_worker_arrived_to_building_site)

        self._queen.events.once('say:nest_is_built', self._on_queen_built_nest)

    def _start_operation(self):
        self._preparation_step()

    def _preparation_step(self):
        self._worker.prepare_for_operation('prepared')
        self._queen.prepare_for_operation('prepared')

    def _on_queen_prepared(self):
        self._flags['is_queen_prepared'] = True
        self._try_start_walk_to_building_site_step()
    
    def _on_worker_prepared(self):
        self._flags['is_worker_prepared'] = True
        self._try_start_walk_to_building_site_step()

    def _try_start_walk_to_building_site_step(self):
        if (self._flags['is_queen_prepared'] and self._flags['is_worker_prepared']):
            self._walk_to_building_site_step()

    def _walk_to_building_site_step(self):
        self._worker.walk_to(self._building_site, 'arrived_to_building_site')
        self._queen.walk_to(self._building_site, 'arrived_to_building_site')

    def _on_queen_arrived_to_building_site(self):
        self._flags['is_queen_arrived_to_building_site'] = True
        self._try_start_building_nest_step()

    def _on_worker_arrived_to_building_site(self):
        self._flags['is_worker_arrived_to_building_site'] = True
        self._try_start_building_nest_step()

    def _try_start_building_nest_step(self):
        if (self._flags['is_queen_arrived_to_building_site'] and self._flags['is_worker_arrived_to_building_site']):
            self._building_nest_step()
    
    def _building_nest_step(self):
        self._new_nest = self._nest_factory.build_new_nest(self._building_site, self._queen.from_colony)
        self._queen.build_new_nest(self._new_nest, 'nest_is_built')

    def _on_queen_built_nest(self):
        self._relocate_step()

    def _relocate_step(self):
        self._queen.relocate_to_nest(self._new_nest)
        self._queen.get_in_nest(self._new_nest)
        self._worker.relocate_to_nest(self._new_nest)
        self._queen.leave_operation()
        self._worker.leave_operation()
        self._mark_as_done()
