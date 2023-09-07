from typing import List
from functools import partial
from core.world.entities.ant.base.ant import Ant
from core.world.entities.colony.colonies.ant_colony.operation.base.operation_types import OperationTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.colony.colonies.ant_colony.operation.base.operation import Operation
from core.world.entities.nest.nest import Nest
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.colony.colonies.ant_colony.operation.base.marker_types import MarkerTypes
from core.world.entities.ant.warrior.warrior_ant import WarriorAnt
from core.world.entities.ant.warrior.warrior_ant_body import WarriorAntBody
from core.world.entities.colony.colonies.ant_colony.formation.formation_factory import FormationFactory

class DestroyNestOperation(Operation):

    def __init__(self, events: EventEmitter, formation_factory: FormationFactory, id: int, hired_ants: List[Ant], flags: dict, nest: Nest):
        self._nest = nest
        super().__init__(events, formation_factory, id, OperationTypes.DESTROY_NEST, hired_ants, flags)
        self._name = 'знищення мурашника'
        self._open_vacancies(AntTypes.WARRIOR, 5)
        self._add_marker(MarkerTypes.CROSS, nest.position)

    @property
    def nest_id(self):
        return self._nest.id

    @property
    def _warriors(self) -> List[WarriorAnt]:
        return self.get_hired_ants(AntTypes.WARRIOR)
    
    def _init_staff(self):
        super()._init_staff()
        formation = self._formation_factory.build_attack_formation(self._nest.position, WarriorAntBody.DISTANCE_PER_SEP)
        for ant in self._warriors:
            ant.set_formation(formation)
            ant.body.sayer.add_listener('prepared', partial(self._on_warrior_prepared, ant))
            ant.body.sayer.add_listener('nest_destroyed', self._on_nest_destroyed)
    
    def _start_operation(self):
        super()._start_operation()
        self._prepare_step()
    
    def _prepare_step(self):
        for ant in self._warriors:
            ant.prepare_for_operation('prepared')

    def _on_warrior_prepared(self, ant: WarriorAnt):
        self._write_flag(f'warrior_{ant.id}_prepared', True)
        if self._check_are_all_warriors_prepared():
            self._attack_step()

    def _check_are_all_warriors_prepared(self):
        for ant in self._warriors:
            if not self._read_flag(f'warrior_{ant.id}_prepared'):
                return False
        return True
    
    def _attack_step(self):
        for ant in self._warriors:
            ant.attack_nest(nest=self._nest, sayback='nest_destroyed')

    def _on_nest_destroyed(self):
        self.done()
    