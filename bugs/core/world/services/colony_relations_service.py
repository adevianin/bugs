from .base_service import BaseService
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.colony.base.colony import Colony
from core.world.settings import ANT_COLONY_ENEMIES_IDS, OFFENSIVE_OPERATION_RELATION_COST

class ColonyRelationsService(BaseService):

    def __init__(self, event_bus: EventEmitter):
        super().__init__(event_bus)

        self._event_bus.add_listener('colony_born', self._on_colony_born)
        self._event_bus.add_listener('colony_died', self._on_colony_died)
        self._event_bus.add_listener('step_done', self._on_step_done)
        self._event_bus.add_listener('offensive_operation', self._on_offensive_operation)

    def set_world(self, world):
        super().set_world(world)
        self._relations_table = world.colony_relations_table

    def _on_colony_born(self, colony: Colony):
        for id in ANT_COLONY_ENEMIES_IDS:
            self._relations_table.set_relation_value(colony.id, id, -1)

    def _on_colony_died(self, colony: Colony):
        self._relations_table.clear_relations_for_colony(colony.id)

    def _on_step_done(self, step_number: int, season):
        self._relations_table.improve_relations_except(ANT_COLONY_ENEMIES_IDS)

    def _on_offensive_operation(self, attacking_colony_id: int, defending_colony_id: int):
        self._relations_table.set_relation_value(attacking_colony_id, defending_colony_id, -OFFENSIVE_OPERATION_RELATION_COST)