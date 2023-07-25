from core.world.entities.colony.colony_factory import ColonyFactory
from core.world.entities.base.entity_collection import EntityCollection
from .json_operation_factory import JsonOperationFactory
from core.world.entities.map.map import Map
from core.world.entities.colony.colony_relations_table import ColonyRelationsTable

class JsonColonyFactory():

    def __init__(self, colony_factory: ColonyFactory, json_operation_factory: JsonOperationFactory):
        self._colony_factory = colony_factory
        self._json_operation_factory = json_operation_factory

    def build_colony_from_json(self, colony_json, entities_collection: EntityCollection, map: Map, colony_relations_table: ColonyRelationsTable):
        operations = []
        for operation_json in colony_json['operations']:
            operations.append(self._json_operation_factory.build_operation_from_json(operation_json, entities_collection))
        return self._colony_factory.build_colony(colony_json['id'], colony_json['owner_id'], map, operations, colony_relations_table)