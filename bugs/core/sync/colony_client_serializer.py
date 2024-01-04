from core.world.entities.colony.base.colony import Colony
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.colony.colonies.ground_beetle_colony.ground_beetle_colony import GroundBeetleColony
from core.world.entities.colony.colonies.ant_colony.ant_colony import AntColony
from .operation_client_serializer import OperationClientSerializer

class ColonyClientSerializer():

    def __init__(self, operation_serializer: OperationClientSerializer):
        self._operation_serializer = operation_serializer

    def serialize(self, colony: Colony):
        match (colony.member_type):
            case EntityTypes.GROUND_BEETLE:
                return self._serialize_ground_beetle_colony(colony)
            case EntityTypes.ANT:
                return self._serialize_ant_colony(colony)
            
    def _serialize_ground_beetle_colony(self, colony: GroundBeetleColony):
        return {
            'id': colony.id
        }
    
    def _serialize_ant_colony(self, colony: AntColony):
        operations_json = [self._operation_serializer.serialize(operation) for operation in colony.operations]
        return {
            'id': colony.id,
            'owner_id': colony.owner_id,
            'queen_id': colony.queen_id,
            'operations': operations_json
        }