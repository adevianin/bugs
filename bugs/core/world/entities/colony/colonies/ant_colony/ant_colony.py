from typing import List, Callable
from core.world.entities.colony.colonies.ant_colony.operation.base.operation import Operation
from core.world.entities.colony.base.relation_tester import RelationTester
from core.world.entities.map.map import Map
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.colony.base.colony import Colony
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.base.entity import Entity
from core.world.entities.ant.base.ant import Ant
from core.world.entities.base.enemy_interface import iEnemy
from core.world.entities.nest.nest import Nest
from core.world.entities.colony.colonies.ant_colony.operation.operation_factory import OperationFactory
from core.world.entities.action.colony_operations_changed_action import ColonyOperationsChangedAction

# fix destorying colony after all nest destroyed
class AntColony(Colony):

    def __init__(self, id: int, event_bus: EventEmitter, operation_factory: OperationFactory, owner_id: int, map: Map, operations: List[Operation], relation_tester: RelationTester, queen_id: int):
        super().__init__(id, EntityTypes.ANT, event_bus, map, relation_tester)
        self._operation_factory = operation_factory
        self._operations: List[Operation] = operations or []
        self._operation_has_changes = False
        self._owner_id = owner_id
        self._queen_id = queen_id

        for operation in self._operations:
            self._listen_operation(operation)

        event_bus.add_listener('step_done', self._on_start_step)

    @property
    def owner_id(self):
        return self._owner_id
    
    @property
    def operations(self):
        return self._operations
    
    @property
    def queen_id(self):
        return self._queen_id
    
    def get_my_nests(self) -> List[Nest]:
        return self._map.get_entities(from_colony_id=self.id, entity_types=[EntityTypes.NEST])
    
    def add_operation(self, operation: Operation):
        operation.id = self._generate_operation_id()
        self._operations.append(operation)

        self._listen_operation(operation)
        self._emit_operation_change()

    def cancel_operation(self, operation_id: int):
        operation = next(filter(lambda op: op.id == operation_id, self._operations), None)
        if operation:
            operation.cancel()

    def _on_my_entity_born(self, entity: Entity):
        super()._on_my_entity_born(entity)
    
    def _on_my_entity_died(self, entity: Entity):
        super()._on_my_entity_died(entity)
        if entity.type == EntityTypes.NEST:
            self._on_colony_nest_destroyed(entity)
    
    def _on_start_step(self, step_number: int):
        self._check_enemies_in_colony_area()
        self._clean_completed_operations()
        self._hire_for_operations()
        if self._operation_has_changes:
            self._emit_operation_change()

    def _listen_operation(self, operation: Operation):
        operation.events.add_listener('change', self._on_operation_change)

    def _hire_for_operations(self):
        ants = self.get_my_members()
        for operation in self._operations:
            for ant in ants:
                if not operation.is_hiring:
                    break
                operation.try_hire_ant(ant)

    def _generate_operation_id(self):
        last_used_id = 0
        for operation in self._operations:
            if operation.id > last_used_id:
                last_used_id = operation.id

        return last_used_id + 1
    
    def _clean_completed_operations(self):
        completed_operations = []
        for operation in self._operations:
            if operation.is_completed:
                completed_operations.append(operation)
        
        for operation in completed_operations:
            self._operations.remove(operation)
    
    def _on_operation_change(self):
        self._operation_has_changes = True

    def _emit_operation_change(self):
        self._emit_action(ColonyOperationsChangedAction.build(self.id, self._operations))
        self._operation_has_changes = False
    
    def _check_enemies_in_colony_area(self):
        my_nests = self.get_my_nests()
        all_enemies_positions = []
        for nest in my_nests:
            enemies_filter: Callable[[Entity], bool] = lambda entity: self._relation_tester.is_enemy(entity)
            enemies: List[iEnemy] = self._map.find_entities_near(point=nest.position, max_distance=nest.area, filter=enemies_filter)

            enemies_count = len(enemies)
            enemies_positions = [enemy.position for enemy in enemies]
            all_enemies_positions += enemies_positions

            if enemies_count > 0:
                nest.raise_attack_alarm(enemies_positions)
            else:   
                nest.cancel_attack_alarm()
        
        all_enemies_count = len(all_enemies_positions)
        if all_enemies_count > 0:
            self._send_signal_to_members({
                'type': 'enemy_spotted_in_colony_area',
                'enemies_positions': all_enemies_positions
            })
        else:
            self._send_signal_to_members({
                'type': 'no_enemies_in_colony_area'
            })

    def _on_colony_nest_destroyed(self, destroyed_nest: Nest):
        remaining_nests_filter: Callable[[Nest], bool] = lambda entity: entity.id != destroyed_nest.id
        remaining_nests = self._map.get_entities(from_colony_id=self.id, entity_types=[EntityTypes.NEST], filter=remaining_nests_filter)
        ants_from_destoyed_nest_filter: Callable[[Ant], bool] = lambda ant: ant.home_nest.id == destroyed_nest.id
        ants_from_destroyed_nest: List[Ant] = self._map.get_entities(from_colony_id=self.id, entity_types=[EntityTypes.ANT], filter=ants_from_destoyed_nest_filter)
        
        if (len(remaining_nests) > 0):
            relocate_nest = remaining_nests[0]
            for ant in ants_from_destroyed_nest:
                ant.relocate_to_nest(relocate_nest)
        else:
            for ant in ants_from_destroyed_nest:
                ant.no_home_die()

    def get_my_members(self) -> List[Ant]:
        return super().get_my_members()