from .base_service import BaseService
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.colony.base.colony import Colony
from core.world.settings import LADYBUG_COLONY_ID, OFFENSIVE_OPERATION_RELATION_COST
from core.world.entities.colony.base.colony_relation_types import ColonyRelationTypes
from typing import List

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
        self._update_enemies_for_all_ant_colonies()

    def _on_colony_born(self, colony: Colony):
        self._relations_table.set_relation_value(colony.id, LADYBUG_COLONY_ID, -1, ColonyRelationTypes.ANT_NPC)

    def _on_colony_died(self, colony: Colony):
        removed_relations = self._relations_table.clear_relations_for_colony(colony.id)
        ids = self._get_ant_colony_ids_from_relations(removed_relations)
        if colony.id in ids:
            ids.remove(colony.id)
        self._update_enemies_for_ant_colonies_by_ids(ids)

    def _on_step_done(self, step_number: int, season):
        removed_positive_relations = self._relations_table.improve_ant_colonies_relations()
        ids = self._get_ant_colony_ids_from_relations(removed_positive_relations)
        self._update_enemies_for_ant_colonies_by_ids(ids)

    def _on_offensive_operation(self, attacking_colony_id: int, defending_colony_id: int):
        self._relations_table.set_relation_value(attacking_colony_id, defending_colony_id, -OFFENSIVE_OPERATION_RELATION_COST, ColonyRelationTypes.ANT_ANT)
        self._update_enemies_for_ant_colonies_by_ids([attacking_colony_id, defending_colony_id])

    def _update_enemies_for_ant_colonies_by_ids(self, ids: List[int]):
        colonies_for_update = [colony for colony in self._world.ant_colonies if colony.id in ids]
        for colony in colonies_for_update:
            enemy_ids = self._relations_table.get_colony_ids_with_negative_relation_to(colony.id)
            colony.set_enemies(enemy_ids)
    
    def _update_enemies_for_all_ant_colonies(self):
        for colony in self._world.ant_colonies:
            enemy_ids = self._relations_table.get_colony_ids_with_negative_relation_to(colony.id)
            colony.set_enemies(enemy_ids, True)

    def _get_ant_colony_ids_from_relations(self, relations: List) -> List[int]:
        ids = set()
        for relation in relations:
            if relation['type'] == ColonyRelationTypes.ANT_ANT:
                ids.update(relation['colony_ids'])

        return list(ids)