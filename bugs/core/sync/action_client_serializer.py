from core.world.action_client_serializer_interface import iActionClientSerializer
from .util_client_serializer import UtilClientSerializer
from .entity_client_serializer import EntityClientSerializer
from .larva_client_serializer import LarvaClientSerializer
from .colony_client_serializer import ColonyClientSerializer
from .operation_client_serializer import OperationClientSerializer
from core.world.entities.action.action import Action
from core.world.entities.action.action_types import ActionTypes

class ActionClientSerializer(iActionClientSerializer):

    def __init__(self, entity_serializer: EntityClientSerializer, util_serializer: UtilClientSerializer, larva_serializer: LarvaClientSerializer,
                 colony_serializer: ColonyClientSerializer, operation_serializer: OperationClientSerializer):
        self._entity_serializer = entity_serializer
        self._util_serializer = util_serializer
        self._larva_serializer = larva_serializer
        self._colony_serializer = colony_serializer
        self._operation_serializer = operation_serializer

    def serialize(self, action: Action):
        match(action.action_type):
            case ActionTypes.ENTITY_BORN:
                return self._serialize_entity_born(action)
            case ActionTypes.ENTITY_DIED:
                return self._default_action_serialize(action)
            case ActionTypes.ENTITY_COLONY_CHANGED:
                return self._default_action_serialize(action)
            case ActionTypes.ENTITY_ROTATED:
                return self._default_action_serialize(action)
            case ActionTypes.ENTITY_HP_CHANGED:
                return self._default_action_serialize(action)
            case ActionTypes.ENTITY_WALK:
                return self._serialize_entity_walk(action)
            case ActionTypes.ENTITY_GOT_IN_NEST:
                return self._default_action_serialize(action)
            case ActionTypes.ENTITY_GOT_OUT_OF_NEST:
                return self._default_action_serialize(action)
            case ActionTypes.ANT_PICKED_UP_ITEM:
                return self._default_action_serialize(action)
            case ActionTypes.ANT_DROPPED_PICKED_ITEM:
                return self._default_action_serialize(action)
            case ActionTypes.ANT_FLEW_NUPTIAL_FLIGHT:
                return self._default_action_serialize(action)
            case ActionTypes.NEST_STORED_CALORIES_CHANGED:
                return self._default_action_serialize(action)
            case ActionTypes.NEST_LARVAE_CHANGED:
                return self._serialize_nest_larvae_changed(action)
            case ActionTypes.NEST_BUILD_STATUS_CHANGED:
                return self._default_action_serialize(action)
            case ActionTypes.ITEM_WAS_PICKED_UP:
                return self._default_action_serialize(action)
            case ActionTypes.ITEM_WAS_DROPPED:
                return self._serialize_item_was_dropped(action)
            case ActionTypes.ITEM_BEING_BRINGED:
                return self._serialize_item_being_bringed(action)
            case ActionTypes.COLONY_BORN:
                return self._serialize_colony_born(action)
            case ActionTypes.COLONY_OPERATIONS_CHANGED:
                return self._serialize_operations_changed(action)
            case _:
                raise Exception('unknown type of action')
            
    def _serialize_common(self, action: Action):
        return  {
            'actor_id': action.actor_id,
            'actor_type': action.actor_type,
            'action_type': action.action_type
        }
            
    def _serialize_entity_born(self, action: Action):
        json = self._serialize_common(action)
        serialized_entity = self._entity_serializer.serialize(action.action_data['entity'])
        json.update({
            'action_data': { 'entity': serialized_entity }
        })

        return json
    
    def _serialize_entity_walk(self, action: Action):
        json = self._serialize_common(action)
        serialized_position = self._util_serializer.serialize_point(action.action_data['position'])
        json.update({
            'action_data': { 'position': serialized_position }
        })

        return json
    
    def _serialize_nest_larvae_changed(self, action: Action):
        json = self._serialize_common(action)

        serialized_larvae = []
        for larva in action.action_data['larvae']:
            serialized_larvae.append(self._larva_serializer.serialize(larva))

        json.update({
            'action_data': { 'larvae': serialized_larvae }
        })

        return json
    
    def _serialize_item_was_dropped(self, action: Action):
        json = self._serialize_common(action)
        serialized_position = self._util_serializer.serialize_point(action.action_data['position'])
        json.update({
            'action_data': { 'position': serialized_position }
        })

        return json
    
    def _serialize_item_being_bringed(self, action: Action):
        json = self._serialize_common(action)
        serialized_new_position = self._util_serializer.serialize_point(action.action_data['new_position'])
        json.update({
            'action_data': { 
                'new_position': serialized_new_position, 
                'bring_user_speed': action.action_data['bring_user_speed'] 
            }
        })

        return json
    
    def _serialize_colony_born(self, action: Action):
        json = self._serialize_common(action)
        serialized_colony = self._colony_serializer.serialize(action.action_data['colony'])

        json.update({
            'action_data': {
                'colony': serialized_colony
            }
        })

        return json
    
    def _serialize_operations_changed(self, action: Action):
        json = self._serialize_common(action)

        serialized_operations = []
        for operation in action.action_data['operations']:
            serialized_operations.append(self._operation_serializer.serialize(operation))

        json.update({
            'action_data': {
                'operations': serialized_operations
            }
        })

        return json
    
    def _default_action_serialize(self, action: Action):
        json = self._serialize_common(action)
        json.update({
            'action_data': action.action_data
        })
        
        return json