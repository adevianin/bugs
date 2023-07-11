from core.world.utils.event_emiter import EventEmitter
from .operation.operation import Operation
from .colony_ants_collection import ColonyAntsCollection

class Colony:

    def __init__(self, id: int, event_bus: EventEmitter, owner_id: int, colony_ants_collection: ColonyAntsCollection):
        self._id = id
        self._event_bus = event_bus
        self._owner_id = owner_id
        self._colony_ants_collection = colony_ants_collection
        self._operations = []
        self._has_changes = False

        event_bus.add_listener('step_start', self._on_start_step)

    @property
    def id(self):
        return self._id

    @property
    def owner_id(self):
        return self._owner_id
    
    @property
    def operations(self):
        return self._operations
    
    def add_operation(self, operation: Operation):
        operation.id = self._generate_operation_id()
        self._operations.append(operation)

        operation.events.add_listener('change', self._on_operation_change)
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
    
    def _on_start_step(self, step_number: int):
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
        for ant in self._colony_ants_collection.ants:
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

