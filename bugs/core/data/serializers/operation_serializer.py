from core.world.entities.colony.operation.operation import Operation
from core.world.entities.colony.operation.operation_types import OperationTypes
from core.world.entities.colony.operation.build_new_nest_operation import BuildNewNestOperation

class OperationSerializer():

    def serialize(self, operation: Operation):
        match(operation.type):
            case OperationTypes.BUILD_NEW_NEST:
                return self._serialize_build_new_nest(operation)

    def _serialize_operation(self, operation: Operation):
        return {
            'id': operation.id,
            'name': operation.name,
            'status': operation.status,
            'markers': operation.markers,
            'vacancies': operation.vacancies,
            'hired': {},
            'is_hiring': operation.is_hiring,
            'name': operation.name,
            'flags': operation.flags
        }

    def _serialize_build_new_nest(self, operation: BuildNewNestOperation):
        json = self._serialize_operation(operation)
        json.update({
        })

        return json
