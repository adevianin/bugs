from core.world.entities.colony.base.colony import Colony
from .operation_serializer import OperationSerializer
from core.world.entities.colony.colonies.ant_colony.ant_colony import AntColony
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.colony.colonies.ground_beetle_colony.ground_beetle_colony import GroundBeetleColony
from core.world.entities.colony.colonies.ladybug_colony.ladybug_colony import LadybugColony

class ColonySerializer():

    def __init__(self, operation_serializer: OperationSerializer):
        self._operation_serializer = operation_serializer

    def serialize(self, colony: Colony):
        match(colony.member_type):
            case EntityTypes.ANT:
                return self._serialize_ant_colony(colony)
            case EntityTypes.GROUND_BEETLE:
                return self._serialize_ground_beetle_colony(colony)
            case EntityTypes.LADYBUG:
                return self._serialize_ladybug_colony(colony)
            case _:
                raise Exception('unknown type of colony')

    def _serialize_colony(self, colony: Colony):
        return {
            'id': colony.id,
            'member_type': colony.member_type
        }
    
    def _serialize_ant_colony(self, colony: AntColony):
        json = self._serialize_colony(colony)
        
        json.update({
            'owner_id': colony.owner_id,
            'operations': [self._operation_serializer.serialize(operation) for operation in colony.operations],
            'queen_id': colony.queen_id
        })

        return json
    
    def _serialize_ground_beetle_colony(self, colony: GroundBeetleColony):
        json = self._serialize_colony(colony)

        json.update({
        })
        return json
    
    def _serialize_ladybug_colony(self, colony: LadybugColony):
        json = self._serialize_colony(colony)

        json.update({
        })
        return json
