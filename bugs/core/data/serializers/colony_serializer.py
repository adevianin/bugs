from core.world.entities.colony.colony import Colony
from .operation_serializer import OperationSerializer

class ColonySerializer():

    def __init__(self, operation_serializer: OperationSerializer):
        self._operation_serializer = operation_serializer

    def serialize(self, colony: Colony):
        operations_json = []
        for operation in colony.operations:
            operations_json.append(self._operation_serializer.serialize(operation))

        return {
            'id': colony.id,
            'owner_id': colony.owner_id,
            'operations': operations_json
        }
