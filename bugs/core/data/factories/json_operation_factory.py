from core.world.entities.colony.operation.operation_factory import OperationFactory
from core.world.utils.point import Point
from core.world.entities.base.entity_collection import EntityCollection
from core.world.entities.colony.operation.operation_types import OperationTypes

class JsonOperationFactory():

    def __init__(self, operation_factory: OperationFactory):
        self._operation_factory = operation_factory

    def build_operation_from_json(self, operation_json: dict, entities_collection: EntityCollection):
        match(operation_json['type']):
            case OperationTypes.BUILD_NEW_NEST:
                return self._build_build_new_nest_operation_from_json(operation_json, entities_collection)
            case OperationTypes.DESTROY_NEST:
                return self._build_destory_nest_operation_from_json(operation_json, entities_collection)
            case _:
                raise Exception('unknown type of operation')

    def _build_build_new_nest_operation_from_json(self, operation_json: dict, entities_collection: EntityCollection):
        hired_ants = self._prepare_hired_ants(operation_json, entities_collection)
        building_site = Point(operation_json['building_site'][0], operation_json['building_site'][1])
        return self._operation_factory.build_build_new_nest_operation(id=operation_json['id'], hired_ants=hired_ants, flags=operation_json['flags'], building_site=building_site)
    
    def _build_destory_nest_operation_from_json(self, operation_json: dict, entities_collection: EntityCollection):
        hired_ants = self._prepare_hired_ants(operation_json, entities_collection)
        nest = entities_collection.get_entity_by_id(operation_json['nest_id'])
        return self._operation_factory.build_destroy_nest_operation(nest=nest, id=operation_json['id'], hired_ants=hired_ants, flags=operation_json['flags'])

    def _prepare_hired_ants(self, operation_json: dict, entities_collection: EntityCollection):
        hired_ants = []
        for hired_ant_id in operation_json['hired']:
            hired_ants.append(entities_collection.get_entity_by_id(hired_ant_id))

        return hired_ants

