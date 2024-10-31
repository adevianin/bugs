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
from core.world.entities.colony.colonies.ant_colony.operation.base.formation.formation_factory import FormationFactory
from core.world.entities.colony.colonies.ant_colony.operation.base.formation.base.base_formation import BaseFormation
from .base.fight.fight_factory import FightFactory
from .base.fight.fight import Fight

class DestroyNestOperation(Operation):

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, formation_factory: FormationFactory, fight_factory: FightFactory, id: int, hired_ants: List[Ant],
                  flags: dict, formation: BaseFormation, fight: Fight, nest: Nest, warriors_count: int):
        self._nest = nest
        self._warriors_count = warriors_count
        super().__init__(event_bus, events, formation_factory, fight_factory, id, OperationTypes.DESTROY_NEST, hired_ants, flags, formation, fight)
        self._name = 'знищення мурашника'
        self._open_vacancies(AntTypes.WARRIOR, self._warriors_count)
        self._add_marker(MarkerTypes.CROSS, nest.position)

        self._aggression_targets_filter = lambda entity: entity.from_colony_id == self._nest.from_colony_id

        self.events.add_listener('formation:march_to_nest_to_destroy:done', self._destroy_step)
        self.events.add_listener('formation:march_to_assemble_point:done', self.done)

        self.events.add_listener('fight_won:preparing', self._prepare_step)
        self.events.add_listener('fight_won:march_to_nest_to_destroy', self._march_to_nest_to_destroy_step)
        self.events.add_listener('fight_won:destroying', self._destroy_step)
        self.events.add_listener('fight_won:march_to_assemble_point', self._march_to_assemble_point)

        self._nest_removel_block_id = self._nest.block_removal()

    @property
    def nest_id(self):
        return self._nest.id
    
    @property
    def warriors_count(self):
        return self._warriors_count

    @property
    def _warriors(self) -> List[WarriorAnt]:
        return self.get_hired_ants(AntTypes.WARRIOR)
    
    def _is_aggressive_now(self):
        return self._read_flag('is_agressive')
    
    def _on_operation_stop(self):
        super()._on_operation_stop()
        self._nest.unblock_removal(self._nest_removel_block_id)
    
    def _setup_operation(self):
        super()._setup_operation()

        for ant in self._warriors:
            ant.body.sayer.add_listener('prepared', partial(self._on_warrior_prepared, ant))
            ant.body.sayer.add_listener('nest_destroyed', self._on_nest_destroyed)
    
    def _start_operation(self):
        super()._start_operation()
        self._prepare_step()
    
    def _prepare_step(self):
        self._stage = 'preparing'
        for ant in self._warriors:
            self._write_ant_flag(ant, 'warrior_ready', False)
            ant.prepare_for_operation(self._assemble_point, 'prepared')

    def _on_warrior_prepared(self, ant: WarriorAnt):
        self._write_ant_flag(ant, 'warrior_ready', True)
        if self._check_ant_flag_for_ants(self._warriors, 'warrior_ready'):
            self._march_to_nest_to_destroy_step()
    
    def _march_to_nest_to_destroy_step(self):
        self._stage = 'march_to_nest_to_destroy'
        self._write_flag('is_agressive', True)
        formation = self._formation_factory.build_attack_formation('march_to_nest_to_destroy', self._warriors, self._nest.position)
        self._register_formation(formation)

    def _destroy_step(self):
        self._stage = 'destroying'
        for ant in self._warriors:
            ant.attack_nest(nest=self._nest, sayback='nest_destroyed')

    def _on_nest_destroyed(self):
        if not self._read_flag('nest_destroyed'):
            self._write_flag('nest_destroyed', True)
            self._write_flag('is_agressive', False)
            self._march_to_assemble_point()

    def _march_to_assemble_point(self):
        self._stage = 'march_to_assemble_point'
        formation = self._formation_factory.build_attack_formation('march_to_assemble_point', self._warriors, self._assemble_point)
        self._register_formation(formation)
    