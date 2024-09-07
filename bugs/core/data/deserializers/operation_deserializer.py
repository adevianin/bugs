from core.world.entities.colony.colonies.ant_colony.operation.operation_factory import OperationFactory
from core.world.utils.point import Point
from core.world.entities.base.entity_collection import EntityCollection
from core.world.entities.colony.colonies.ant_colony.operation.base.operation_types import OperationTypes
from .formation_deserializer import FormationDeserializer

class OperationDeserializer():

    def __init__(self, operation_factory: OperationFactory, formation_deserializer: FormationDeserializer):
        self._operation_factory = operation_factory
        self._formation_deserializer = formation_deserializer

    def deserialize_operation(self, operation_json: dict, entities_collection: EntityCollection):
        match(operation_json['type']):
            case OperationTypes.BUILD_NEW_SUB_NEST:
                return self._build_build_new_sub_nest_operation_from_json(operation_json, entities_collection)
            case OperationTypes.DESTROY_NEST:
                return self._build_destory_nest_operation_from_json(operation_json, entities_collection)
            case OperationTypes.BRING_ITEM_TO_NEST:
                return self._build_bring_item_to_nest_operation_from_json(operation_json, entities_collection)
            case OperationTypes.PILLAGE_NEST:
                return self._build_pillage_nest_operation_from_json(operation_json, entities_collection)
            case OperationTypes.TRANSPORT_FOOD:
                return self._build_transport_food_operation(operation_json, entities_collection)
            case OperationTypes.BUILD_FORTIFICATION:
                return self._build_build_fortification_operation(operation_json, entities_collection)
            case _:
                raise Exception('unknown type of operation')
            
    def _deserialize_basic_operation_props(self, operation_json: dict, entities_collection: EntityCollection):
        return {
            'id': operation_json['id'],
            'hired_ants': entities_collection.get_entities(operation_json['hired_ants']),
            'flags': operation_json['flags'],
            'formations': [self._formation_deserializer.deserialize_formation(formation_json, entities_collection) for formation_json in operation_json['formations']]
        }

    def _build_build_new_sub_nest_operation_from_json(self, operation_json: dict, entities_collection: EntityCollection):
        props = self._deserialize_basic_operation_props(operation_json, entities_collection)
        props.update({
            'building_site': Point.from_json(operation_json['building_site']),
            'workers_count': operation_json['workers_count']
        })
        return self._operation_factory.build_build_new_sub_nest_operation(**props)
    
    def _build_destory_nest_operation_from_json(self, operation_json: dict, entities_collection: EntityCollection):
        props = self._deserialize_basic_operation_props(operation_json, entities_collection)
        props.update({
            'nest': entities_collection.get_entity_by_id(operation_json['nest_id']),
            'warriors_count': operation_json['warriors_count']
        })
        return self._operation_factory.build_destroy_nest_operation(**props)
    
    def _build_bring_item_to_nest_operation_from_json(self, operation_json: dict, entities_collection: EntityCollection):
        props = self._deserialize_basic_operation_props(operation_json, entities_collection)
        props.update({
            'nest': entities_collection.get_entity_by_id(operation_json['nest_id']),
            'item': entities_collection.get_entity_by_id(operation_json['item_id'])
        })
        return self._operation_factory.build_bring_item_to_nest_operation(**props)

    def _build_pillage_nest_operation_from_json(self, operation_json: dict, entities_collection: EntityCollection):
        props = self._deserialize_basic_operation_props(operation_json, entities_collection)
        props.update({
            'nest_to_pillage': entities_collection.get_entity_by_id(operation_json['nest_to_pillage_id']),
            'nest_for_loot': entities_collection.get_entity_by_id(operation_json['nest_for_loot_id']),
            'workers_count': operation_json['workers_count'],
            'warriors_count': operation_json['warriors_count']
        })
        
        return self._operation_factory.build_pillage_nest_operation(**props)
    
    def _build_transport_food_operation(self, operation_json: dict, entities_collection: EntityCollection):
        props = self._deserialize_basic_operation_props(operation_json, entities_collection)
        props.update({
            'nest_from': entities_collection.get_entity_by_id(operation_json['nest_from_id']),
            'nest_to': entities_collection.get_entity_by_id(operation_json['nest_to_id']),
            'workers_count': operation_json['workers_count'],
            'warriors_count': operation_json['warriors_count']
        })
        
        return self._operation_factory.build_transport_food_operation(**props)
    
    def _build_build_fortification_operation(self, operation_json: dict, entities_collection: EntityCollection):
        props = self._deserialize_basic_operation_props(operation_json, entities_collection)
        props.update({
            'nest': entities_collection.get_entity_by_id(operation_json['nest_id']),
            'workers_count': operation_json['workers_count']
        })
        
        return self._operation_factory.build_build_fortification(**props)