from core.world.utils.event_emiter import EventEmitter
from .operation.operation import Operation
from core.world.entities.base.entity import Entity
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.ant.base.ant_types import AntTypes
from typing import List, Callable
from core.world.entities.nest.nest import Nest
from core.world.entities.map.map import Map
from core.world.entities.ant.base.ant import Ant
from .relation_tester import RelationTester
from core.world.entities.base.enemy_interface import iEnemy

class Colony:

    def __init__(self, id: int, event_bus: EventEmitter, owner_id: int, map: Map, operations: List[Operation], relation_tester: RelationTester, colony_communicator: EventEmitter):
        self._id = id
        self._event_bus = event_bus
        self._owner_id = owner_id
        self._map = map
        self._operations = operations or []
        self._has_changes = False
        self._relation_tester = relation_tester
        self._colony_communicator = colony_communicator

        for operation in self._operations:
            self._listen_operation(operation)

        for ant in self.get_my_ants():
            self._handle_my_ant(ant)

        event_bus.add_listener('step_start', self._on_start_step)
        self._map.events.add_listener('entity_died', self._on_entity_died)
        self._map.events.add_listener('entity_born', self._on_entity_born)

    @property
    def id(self):
        return self._id

    @property
    def owner_id(self):
        return self._owner_id
    
    @property
    def operations(self):
        return self._operations
    
    def get_my_ants(self):
        return self._map.get_entities(from_colony_id=self.id, entity_types=[EntityTypes.ANT])
    
    def get_my_nests(self):
        return self._map.get_entities(from_colony_id=self.id, entity_types=[EntityTypes.NEST])
    
    def add_operation(self, operation: Operation):
        operation.id = self._generate_operation_id()
        self._operations.append(operation)

        self._listen_operation(operation)
        self._emit_colony_change()

    def stop_operation(self, operation_id: int):
        operation = next(filter(lambda op: op.id == operation_id, self._operations), None)
        if operation:
            operation.stop_operation()
    
    def to_public_json(self):
        operations_json = []
        for operation in self._operations:
            operations_json.append(operation.to_public_json())

        return {
            'id': self._id,
            'owner_id': self._owner_id,
            'operations': operations_json
        }
    
    def _handle_my_ant(self, ant: Ant):
        ant.body.set_relation_tester(self._relation_tester)
        ant.body.set_colony_communicator(self._colony_communicator)
    
    def _listen_operation(self, operation: Operation):
        operation.events.add_listener('change', self._on_operation_change)
    
    def _on_start_step(self, step_number: int):
        self._check_enemies_in_colony_area()
        self._clean_done_operations()
        self._hire_for_operations()
        if self._has_changes:
            self._emit_colony_change()

    def _hire_for_operations(self):
        if len(self._operations) == 0:
            return
        for operation in self._operations:
            if operation.is_hiring:
                self._hire_for_operation(operation)

    def _hire_for_operation(self, operation: Operation):
        for ant in self.get_my_ants():
            if not operation.is_hiring:
                return
            hiring_types = operation.get_hiring_ant_types()
            if not ant.is_in_operation and ant.ant_type in hiring_types:
                ant_answer = ant.ask_participation()
                if ant_answer:
                    ant.join_operation()
                    operation.hire_ant(ant)

    def _generate_operation_id(self):
        last_used_id = 0
        for operation in self._operations:
            if operation.id > last_used_id:
                last_used_id = operation.id

        return last_used_id + 1
    
    def _clean_done_operations(self):
        done_operations = []
        for operation in self._operations:
            if operation.is_done:
                done_operations.append(operation)
        
        for operation in done_operations:
            self._remove_operation(operation)
    
    def _remove_operation(self, operation: Operation):
        operation.events.remove_listener('change', self._on_operation_change)
        self._operations.remove(operation)

    def _on_operation_change(self):
        self._has_changes = True

    def _emit_colony_change(self):
        self._event_bus.emit(f'colony:{self.id}:changed')
        self._has_changes = False

    def _on_entity_died(self, entity: Entity):
        is_mine = entity.from_colony == self._id
        if is_mine:

            if entity.type == EntityTypes.NEST:
                self._on_colony_nest_destroyed(entity)

    def _on_entity_born(self, entity: Entity):
        is_mine = entity.from_colony == self._id
        if is_mine:

            if entity.type == EntityTypes.ANT:
                self._handle_my_ant(entity)

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
                ant.die()

    def _check_enemies_in_colony_area(self):
        my_nests = self.get_my_nests()
        for nest in my_nests:
            enemies_filter: Callable[[Entity], bool] = lambda entity: self._relation_tester.is_enemy(entity)
            enemies: List[iEnemy] = self._map.find_entities_near(point=nest.position, max_distance=nest.area, filter=enemies_filter)
            defenders_filter: Callable[[Ant], bool] = lambda entity: entity.ant_type == AntTypes.WARRIOR and entity.from_colony == self.id
            defenders: List[Ant] = self._map.find_entities_near(point=nest.position, max_distance=nest.area, entity_types=[EntityTypes.ANT], filter=defenders_filter)

            enemies_count = len(enemies)
            defenders_count = len(defenders)
            enemies_positions = [enemy.position for enemy in enemies]

            if enemies_count > 0:
                self._colony_communicator.emit('enemy_spotted', nest, enemies_positions)

            if enemies_count > defenders_count:
                self._colony_communicator.emit('reinforcement_needed', nest, enemies_positions)

        

