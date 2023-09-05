from core.world.entities.colony.colony import Colony
from .operation_serializer import OperationSerializer
from core.world.entities.colony.ant_colony import AntColony
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.colony.ground_beetle_colony import GroundBeetleColony

class ColonySerializer():

    def __init__(self, operation_serializer: OperationSerializer):
        self._operation_serializer = operation_serializer

    def serialize(self, colony: Colony):
        match(colony.member_type):
            case EntityTypes.ANT:
                return self._serialize_ant_colony(colony)
            case EntityTypes.GROUND_BEETLE:
                return self._serialize_ground_beetle_colony(colony)
            case _:
                raise Exception('unknown type of colony')

    def _serialize_colony(self, colony: Colony):
        return {
            'id': colony.id,
            'member_type': colony.member_type
        }
    
    def _serialize_ant_colony(self, colony: AntColony):
        json = self._serialize_colony(colony)
        operations_json = []
        for operation in colony.operations:
            operations_json.append(self._operation_serializer.serialize(operation))
        
        json.update({
            'owner_id': colony.owner_id,
            'operations': operations_json,
            'last_registered_entities_in_colony_area_ids': colony.last_registered_entities_in_colony_area_ids
        })

        return json
    
    def _serialize_ground_beetle_colony(self, colony: GroundBeetleColony):
        json = self._serialize_colony(colony)

        json.update({
        })
        return json
