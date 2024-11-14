from .colony_relations_table import ColonyRelationsTable
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.colony.base.colony import Colony
from core.world.settings import GROUND_BEETLE_COLONY_ID, OFFENSIVE_OPERATION_RELATION_COST

class ColonyRelationsManager():

    def __init__(self, event_bus: EventEmitter, relations_table: ColonyRelationsTable):
        self._event_bus = event_bus
        self._relations_table = relations_table

        self._event_bus.add_listener('colony_born', self._on_colony_born)
        self._event_bus.add_listener('colony_died', self._on_colony_died)
        self._event_bus.add_listener('step_done', self._on_step_done)
        self._event_bus.add_listener('offensive_operation', self._on_offensive_operation)

    @property
    def relations_table(self) -> ColonyRelationsTable:
        return self._relations_table

    def _on_colony_born(self, colony: Colony):
        self._relations_table.set_relation_value(colony.id, GROUND_BEETLE_COLONY_ID, -1)

    def _on_colony_died(self, colony: Colony):
        self._relations_table.clear_relations_for_colony(colony.id)

    def _on_step_done(self, step_number: int):
        self._relations_table.improve_relations([GROUND_BEETLE_COLONY_ID])

    def _on_offensive_operation(self, attacking_colony_id: int, defending_colony_id: int):
        self._relations_table.set_relation_value(attacking_colony_id, defending_colony_id, -OFFENSIVE_OPERATION_RELATION_COST)
