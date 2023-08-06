from typing import List
from functools import partial
from core.world.entities.ant.base.ant import Ant
from core.world.entities.colony.operation.operation_types import OperationTypes
from core.world.utils.event_emiter import EventEmitter
from .operation import Operation
from core.world.entities.nest.nest import Nest
from core.world.entities.ant.base.ant_types import AntTypes
from .marker_types import MarkerTypes
from core.world.entities.ant.warrior.warrior_ant import WarriorAnt
from core.world.entities.base.enemy_interface import iEnemy

class DestroyNestOperation(Operation):

    def __init__(self, events: EventEmitter, id: int, hired_ants: List[Ant], flags: dict, nest: Nest):
        super().__init__(events, id, OperationTypes.DESTROY_NEST, hired_ants, flags)
        self._nest = nest
        self._name = 'знищення мурашника'
        self._open_vacancies(AntTypes.WARRIOR, 2)
        self._add_marker(MarkerTypes.CROSS, nest.position)

    @property
    def nest_id(self):
        return self._nest.id

    @property
    def _warriors(self) -> List[WarriorAnt]:
        return self.get_hired_ants(AntTypes.WARRIOR)
    
    def _init_staff(self):
        super()._init_staff()
        for ant in self._warriors:
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
        for ant in self._warriors:
            ant.leave_operation()
        self.done()
    
    

    