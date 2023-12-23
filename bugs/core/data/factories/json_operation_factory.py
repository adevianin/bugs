from core.world.entities.colony.colonies.ant_colony.operation.operation_factory import OperationFactory
from core.world.utils.point import Point
from core.world.entities.base.entity_collection import EntityCollection
from core.world.entities.colony.colonies.ant_colony.operation.base.operation_types import OperationTypes
from core.data.factories.json_formation_factory import JsonFormationFactory

class JsonOperationFactory():

    def __init__(self, operation_factory: OperationFactory, json_formation_factory: JsonFormationFactory):
        self._operation_factory = operation_factory
        self._json_formation_factory = json_formation_factory

    def build_operation_from_json(self, operation_json: dict, entities_collection: EntityCollection):
        match(operation_json['type']):
            case OperationTypes.BUILD_NEW_SUB_NEST:
                return self._build_build_new_sub_nest_operation_from_json(operation_json, entities_collection)
            case OperationTypes.DESTROY_NEST:
                return self._build_destory_nest_operation_from_json(operation_json, entities_collection)
            case OperationTypes.BRING_ITEM_TO_NEST:
                return self._build_bring_item_to_nest_operation_from_json(operation_json, entities_collection)
            case OperationTypes.PILLAGE_NEST:
                return self._build_pillage_nest_operation_from_json(operation_json, entities_collection)
            case _:
                raise Exception('unknown type of operation')

    def _build_build_new_sub_nest_operation_from_json(self, operation_json: dict, entities_collection: EntityCollection):
        hired_ants = entities_collection.get_entities(operation_json['hired'])
        building_site = Point.from_json(operation_json['building_site'])
        workers_count = operation_json['workers_count']
        return self._operation_factory.build_build_new_sub_nest_operation(id=operation_json['id'], hired_ants=hired_ants, flags=operation_json['flags'], building_site=building_site, workers_count=workers_count)
    
    def _build_destory_nest_operation_from_json(self, operation_json: dict, entities_collection: EntityCollection):
        hired_ants = entities_collection.get_entities(operation_json['hired'])
        nest = entities_collection.get_entity_by_id(operation_json['nest_id'])
        attack_formation = self._json_formation_factory.build_formation_from_json(operation_json['attack_formation'], entities_collection)
        return self._operation_factory.build_destroy_nest_operation(nest=nest, id=operation_json['id'], hired_ants=hired_ants, flags=operation_json['flags'], attack_formation=attack_formation)
    
    def _build_bring_item_to_nest_operation_from_json(self, operation_json: dict, entities_collection: EntityCollection):
        hired_ants = entities_collection.get_entities(operation_json['hired'])
        nest = entities_collection.get_entity_by_id(operation_json['nest_id'])
        item = entities_collection.get_entity_by_id(operation_json['item_id'])
        bring_item_formation = self._json_formation_factory.build_formation_from_json(operation_json['bring_item_formation'], entities_collection)
        return self._operation_factory.build_bring_item_to_nest_operation(nest=nest, item=item, id=operation_json['id'], hired_ants=hired_ants, flags=operation_json['flags'], bring_item_formation=bring_item_formation)

    def _build_pillage_nest_operation_from_json(self, operation_json: dict, entities_collection: EntityCollection):
        hired_ants = entities_collection.get_entities(operation_json['hired'])
        nest_to_pillage = entities_collection.get_entity_by_id(operation_json['nest_to_pillage_id'])
        nest_to_unload = entities_collection.get_entity_by_id(operation_json['nest_to_unload_id'])
        attack_formation = self._json_formation_factory.build_formation_from_json(operation_json['attack_formation'], entities_collection)
        go_home_formation = self._json_formation_factory.build_formation_from_json(operation_json['go_home_formation'], entities_collection)
        id = operation_json['id']
        flags=operation_json['flags']
        return self._operation_factory.build_pillage_nest_operation(nest_to_pillage=nest_to_pillage, nest_to_unload=nest_to_unload, id=id, hired_ants=hired_ants, flags=flags, attack_formation=attack_formation, go_home_formation=go_home_formation)