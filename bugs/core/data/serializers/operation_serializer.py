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
            'hired': [ant.id for ant in operation.get_hired_ants()],
            'flags': operation.flags,
            'type': operation.type
        }

    def _serialize_build_new_nest(self, operation: BuildNewNestOperation):
        json = self._serialize_operation(operation)
        json.update({
            'building_site': operation.building_site
        })

        return json
