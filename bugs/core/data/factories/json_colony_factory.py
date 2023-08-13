from core.world.entities.colony.colony_factory import ColonyFactory
from core.world.entities.base.entity_collection import EntityCollection
from .json_operation_factory import JsonOperationFactory
from core.world.entities.map.map import Map
from core.world.entities.colony.colony_relations_table import ColonyRelationsTable
from core.world.entities.base.entity_types import EntityTypes

class JsonColonyFactory():

    def __init__(self, colony_factory: ColonyFactory, json_operation_factory: JsonOperationFactory):
        self._colony_factory = colony_factory
        self._json_operation_factory = json_operation_factory

    def build_colony_from_json(self, colony_json, entities_collection: EntityCollection, map: Map, colony_relations_table: ColonyRelationsTable):
        match(colony_json['member_type']):
            case EntityTypes.ANT:
                return self._build_ant_colony(colony_json, entities_collection, map, colony_relations_table)
            case _:
                raise Exception('unknown type of colony')
    
    def _build_ant_colony(self, colony_json, entities_collection: EntityCollection, map: Map, colony_relations_table: ColonyRelationsTable):
        operations = []
        for operation_json in colony_json['operations']:
            operations.append(self._json_operation_factory.build_operation_from_json(operation_json, entities_collection))
        return self._colony_factory.build_ant_colony(colony_json['id'], colony_json['owner_id'], map, operations, colony_relations_table)