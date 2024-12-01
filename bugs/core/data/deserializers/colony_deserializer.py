from core.world.entities.colony.colony_factory import ColonyFactory
from core.world.entities.base.entity_collection import EntityCollection
from .operation_deserializer import OperationDeserializer
from core.world.entities.map.map import Map
from core.world.entities.colony.base.colony_relations_table import ColonyRelationsTable
from core.world.entities.base.entity_types import EntityTypes

class ColonyDeserializer():

    def __init__(self, colony_factory: ColonyFactory, operation_deserializer: OperationDeserializer):
        self._colony_factory = colony_factory
        self._operation_deserializer = operation_deserializer

    def deserialize_colony(self, colony_json, entities_collection: EntityCollection, map: Map, colony_relations_table: ColonyRelationsTable):
        match(colony_json['member_type']):
            case EntityTypes.ANT:
                return self._build_ant_colony(colony_json, entities_collection, map, colony_relations_table)
            case EntityTypes.LADYBUG:
                return self._build_ladybug_colony(colony_json, map, colony_relations_table)
            case _:
                raise Exception('unknown type of colony')
    
    def _build_ant_colony(self, colony_json, entities_collection: EntityCollection, map: Map, colony_relations_table: ColonyRelationsTable):
        operations = [self._operation_deserializer.deserialize_operation(operation_json, entities_collection) for operation_json in colony_json['operations']]
        id = colony_json['id']
        owner_id = colony_json['owner_id']
        return self._colony_factory.build_ant_colony(id, owner_id, map, operations, colony_relations_table)
    
    def _build_ladybug_colony(self, colony_json, map: Map, colony_relations_table: ColonyRelationsTable):
        return self._colony_factory.build_ladybug_colony(colony_json['id'], map, colony_relations_table)
