from core.world.entities.colony.operation.operation import Operation
from core.world.entities.colony.operation.operation_types import OperationTypes
from core.world.entities.colony.operation.build_new_nest_operation import BuildNewNestOperation
from core.world.entities.colony.operation.destroy_nest_operation import DestroyNestOperation

class OperationSerializer():

    def serialize(self, operation: Operation):
        match(operation.type):
            case OperationTypes.BUILD_NEW_NEST:
                return self._serialize_build_new_nest(operation)
            case OperationTypes.DESTROY_NEST:
                return self._serialize_destroy_nest(operation)
            case _:
                raise Exception('unknown type of operation')

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
    
    def _serialize_destroy_nest(self, operation: DestroyNestOperation):
        json = self._serialize_operation(operation)
        json.update({
            'nest_id': operation.nest_id
        })

        return json
