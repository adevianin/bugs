from core.world.utils.point import Point
from core.world.entities.colony.colonies.ant_colony.operation.base.operation import Operation
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.colony.colonies.ant_colony.operation.base.operation_types import OperationTypes
from typing import List
from core.world.entities.ant.base.ant import Ant
from core.world.entities.ant.queen.queen_ant import QueenAnt
from core.world.entities.nest.nest import Nest
from core.world.entities.colony.colonies.ant_colony.operation.base.marker_types import MarkerTypes
from core.world.entities.ant.base.larva import Larva
from core.world.entities.colony.colonies.ant_colony.formation.formation_factory import FormationFactory

class BuildNewNestOperation(Operation):
    
    def __init__(self, events: EventEmitter, formation_factory: FormationFactory, id: int, hired_ants: List[Ant], flags: dict, building_site: Point):
        super().__init__(events, formation_factory, id, OperationTypes.BUILD_NEW_NEST, hired_ants, flags)
        self._building_site = building_site
        self._name = 'новий мурашник'
        self._open_vacancies(AntTypes.QUEEN, 1)
        self._add_marker(MarkerTypes.POINTER, self._building_site)

    @property
    def building_site(self):
        return self._building_site
    
    def _init_staff(self):
        super()._init_staff()
        
        self._queen: QueenAnt = self.get_hired_ants(AntTypes.QUEEN)[0]

        self._queen.body.sayer.add_listener('arrived_to_building_site', self._on_queen_arrived_to_building_site)
        self._queen.body.sayer.add_listener('nest_is_found', self._on_queen_found_nest)
        self._queen.body.sayer.add_listener('nest_is_built', self._on_nest_built)

    def _start_operation(self):
        super()._start_operation()
        self._walk_to_building_site_step()

    def _walk_to_building_site_step(self):
        self._queen.walk_to(self._building_site, 'arrived_to_building_site')

    def _on_queen_arrived_to_building_site(self):
        self._write_flag('is_queen_arrived_to_building_site', True)
        self._building_nest_step()

    def _building_nest_step(self):
        self._queen.found_nest(self._building_site, sayback='nest_is_found')

    def _on_queen_found_nest(self, results):
        self._new_nest: Nest = results['nest']
        self._build_nest_step()

    def _build_nest_step(self):
        self._queen.build_nest(self._new_nest, sayback='nest_is_built')

    def _on_nest_built(self, nest: Nest):
        self._relocate_step(nest)

    def _relocate_step(self, nest: Nest):
        self._queen.relocate_to_nest(nest)
        self._queen.get_in_nest(nest)
        self._new_nest.take_calories(500)
        self._new_nest.add_larva(Larva.build_larva(AntTypes.WORKER, self._queen.body.dna_profile, 0))

        self.done()
