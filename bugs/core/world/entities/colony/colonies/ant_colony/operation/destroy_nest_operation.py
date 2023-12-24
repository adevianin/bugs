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
from core.world.entities.colony.colonies.ant_colony.formation.base.formation_manager import FormationManager
from core.world.entities.colony.colonies.ant_colony.formation.attack_formation import AttackFormation

class DestroyNestOperation(Operation):

    def __init__(self, events: EventEmitter, formation_manager: FormationManager, id: int, hired_ants: List[Ant], flags: dict, nest: Nest, warriors_count: int, attack_formation: AttackFormation = None):
        self._nest = nest
        self._attack_formation = attack_formation
        self._warriors_count = warriors_count
        super().__init__(events, formation_manager, id, OperationTypes.DESTROY_NEST, hired_ants, flags)
        self._name = 'знищення мурашника'
        self._open_vacancies(AntTypes.WARRIOR, self._warriors_count)
        self._add_marker(MarkerTypes.CROSS, nest.position)

    @property
    def nest_id(self):
        return self._nest.id
    
    @property
    def attack_foration(self) -> AttackFormation:
        return self._attack_formation
    
    @property
    def warriors_count(self):
        return self._warriors_count

    @property
    def _warriors(self) -> List[WarriorAnt]:
        return self.get_hired_ants(AntTypes.WARRIOR)
    
    def _init_staff(self):
        super()._init_staff()

        self._attack_formation = self._attack_formation or self._formation_manager.prepare_attack_formation(self._warriors, self._nest.position)
        self._attack_formation.events.add_listener('reached_destination', self._on_formation_reached_destination)
        
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
        self._attack_formation.activate()

    def _on_formation_reached_destination(self):
        self._destroy_step()

    def _destroy_step(self):
        for ant in self._warriors:
            ant.attack_nest(nest=self._nest, sayback='nest_destroyed')

    def _on_nest_destroyed(self):
        self.done()
    