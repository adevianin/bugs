from core.world.entities.colony.colonies.ant_colony.operation.base.operation import Operation

class OperationClientSerializer():

    def serialize(self, operation: Operation):
        return {
            'id': operation.id,
            'name': operation.name,
            'status': operation.status,
            'markers': operation.markers
        }