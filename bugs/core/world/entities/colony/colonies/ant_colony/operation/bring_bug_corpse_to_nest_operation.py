from core.world.entities.ant.base.ant import Ant
from core.world.entities.colony.colonies.ant_colony.operation.base.operation import Operation
from core.world.entities.colony.colonies.ant_colony.operation.base.marker_types import MarkerTypes
from core.world.entities.colony.colonies.ant_colony.operation.base.operation_types import OperationTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.ant.base.ant import Ant
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.nest.nest import Nest
from core.world.entities.colony.colonies.ant_colony.operation.base.formation.formation_factory import FormationFactory
from core.world.entities.colony.colonies.ant_colony.operation.base.formation.base.base_formation import BaseFormation
from .base.fight.fight_factory import FightFactory
from .base.fight.fight import Fight
from core.world.utils.point import Point
from core.world.entities.item.items.bug_corpse.bug_corpse_item import BugCorpseItem

from typing import List
from functools import partial

class BringBugCorpseToNestOperation(Operation):

    WORKERS_COUNT = 3

    class Flags(Operation.Flags):
        ANT_FLAG_NEAR_BUG_CORPSE = 'near_bug_corpse'

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, formation_factory: FormationFactory, fight_factory: FightFactory, id: int, hired_ants: List[Ant], 
                 flags: dict, formation: BaseFormation, fight: Fight, nest: Nest, search_bug_corpse_location: Point, found_bug_corpse: BugCorpseItem):
        super().__init__(event_bus, events, formation_factory, fight_factory, id, OperationTypes.BRING_BUG_CORPSE_TO_NEST, hired_ants, flags, formation, fight)
        self._name = 'перенести в гніздо'
        self._open_vacancies(AntTypes.WORKER, self.WORKERS_COUNT)
        self._add_marker(MarkerTypes.EAT, search_bug_corpse_location)
        self._nest = nest
        self._search_bug_corpse_location = search_bug_corpse_location
        self._found_bug_corpse_item = found_bug_corpse

        self._nest_removal_block_id = self._nest.block_removal()

    @property
    def nest_id(self):
        return self._nest.id

    @property
    def search_bug_corpse_location(self):
        return self._search_bug_corpse_location

    @property
    def found_bug_corpse_item_id(self) -> BugCorpseItem:
        return self._found_bug_corpse_item.id if self._found_bug_corpse_item else None

    def _setup_operation(self):
        super()._setup_operation()

        self.events.add_listener('formation:march_to_bug_corpse:done', self._approach_search_bug_corpse_location_step)
        self.events.add_listener('formation:bringing_bug_corpse:done', self._give_corpse_to_nest_step)

        self.events.add_listener('fight_won:march_to_bug_corpse_location_stage', self._has_sufficient_workers_step_decorator(self._march_to_search_bug_corpse_location_step, self.WORKERS_COUNT))
        self.events.add_listener('fight_start:bringing_bug_corpse_stage', self._on_bringing_stopped)
        self.events.add_listener('fight_won:bringing_bug_corpse_stage', self._has_sufficient_workers_step_decorator(self._march_to_search_bug_corpse_location_step, self.WORKERS_COUNT))

        self.events.add_listener('hired_ant_died', self._on_ant_died)

        for ant in self._workers:
            ant.body.sayer.add_listener('ant_near_search_bug_corpse_location', partial(self._on_ant_near_search_bug_corpse_position, ant))

    def _on_operation_stop(self):
        super()._on_operation_stop()
        self._nest.unblock_removal(self._nest_removal_block_id)

    def _start_operation(self):
        super()._start_operation()
        self._prepare_step()

    def _on_all_ants_prepared(self):
        self._march_to_search_bug_corpse_location_step()

    def _march_to_search_bug_corpse_location_step(self):
        self._stage = 'march_to_bug_corpse_location_stage'
        units = self._workers
        if self._check_is_formation_needed(units, self._search_bug_corpse_location):
            formation = self._formation_factory.build_convoy_formation('march_to_bug_corpse', units, self._search_bug_corpse_location)
            self._register_formation(formation)
        else:
            self._approach_search_bug_corpse_location_step()

    def _approach_search_bug_corpse_location_step(self):
        for ant in self._workers:
            self._write_ant_flag(ant, self.Flags.ANT_FLAG_NEAR_BUG_CORPSE, False)
            ant.walk_to(self._search_bug_corpse_location, 'ant_near_search_bug_corpse_location')

    def _on_ant_near_search_bug_corpse_position(self, ant: Ant):
        self._write_ant_flag(ant, self.Flags.ANT_FLAG_NEAR_BUG_CORPSE, True)
        if self._check_ant_flag_for_ants(self._workers, self.Flags.ANT_FLAG_NEAR_BUG_CORPSE):
            self._find_bug_corpse_step()
    
    def _find_bug_corpse_step(self):
        found_bug_corpse = self._find_bug_corpse()

        if not found_bug_corpse:
            self._march_to_assemble_point_for_completion_step()
            return

        if found_bug_corpse.position.is_equal(self._search_bug_corpse_location):
            self._found_bug_corpse_item = found_bug_corpse
            self._bring_bug_corpse_step()
        else:
            self._search_bug_corpse_location = found_bug_corpse.position
            self._march_to_search_bug_corpse_location_step()
        
    def _bring_bug_corpse_step(self):
        self._stage = 'bringing_bug_corpse_stage'
        formation = self._formation_factory.build_bring_item_formation('bringing_bug_corpse', self._workers, self._nest.position, self._found_bug_corpse_item)
        self._register_formation(formation)

    def _give_corpse_to_nest_step(self):
        if self._nest.is_died:
            self._march_to_assemble_point_for_completion_step()
            return
        
        self._nest.take_edible_item(self._found_bug_corpse_item)
        self._march_to_assemble_point_for_completion_step()

    def _find_bug_corpse(self) -> BugCorpseItem:
        bug_corpse_items = self._workers[0].look_around_for_bug_corpses()
        for bug_corpse in bug_corpse_items:
            return bug_corpse

        return None
    
    def _on_bringing_stopped(self):
        self._search_bug_corpse_location = self._found_bug_corpse_item.position
        self._found_bug_corpse_item = None

    def _on_ant_died(self, ant: Ant):
        self.cancel()