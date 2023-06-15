from core.world.utils.event_emiter import EventEmitter
from .operation.operation import Operation
from core.world.map import Map

class Colony:

    def __init__(self, id: int, event_bus: EventEmitter, owner_id: int, map: Map):
        self._id = id
        self._event_bus = event_bus
        self._owner_id = owner_id
        self._map = map
        self._operations = []

        event_bus.add_listener('step_start', self._on_start_step)

    @property
    def id(self):
        return self._id

    @property
    def owner_id(self):
        return self._owner_id
    
    @property
    def _my_ants(self):
        return self._map.get_ants_from_colony(self._id)
    
    def add_operation(self, operation: Operation):
        self._operations.append(operation)
    
    def to_json(self):
        return {
            'id': self._id,
            'owner_id': self._owner_id
        }
    
    def _on_start_step(self, step_number: int):
        if len(self._operations) == 0:
            return
        for operation in self._operations:
            if operation.is_hiring:
                self._hire_for_operation(operation)

    def _hire_for_operation(self, operation: Operation):
        for ant in self._my_ants:
            if not operation.is_hiring:
                return
            hiring_types = operation.get_hiring_ant_types()
            if not ant.is_in_operation and ant.ant_type in hiring_types:
                ant_answer = ant.ask_participation()
                if ant_answer:
                    ant.join_operation()
                    operation.hire_ant(ant)
