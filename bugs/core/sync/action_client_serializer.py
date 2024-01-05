from core.world.action_client_serializer_interface import iActionClientSerializer
from .util_client_serializer import UtilClientSerializer
from .entity_client_serializer import EntityClientSerializer
from .larva_client_serializer import LarvaClientSerializer
from .colony_client_serializer import ColonyClientSerializer
from .operation_client_serializer import OperationClientSerializer
from core.world.entities.action.base.action import Action
from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.entity_born_action import EntityBornAction
from core.world.entities.action.entity_colony_changed_action import EntityColonyChangedAction
from core.world.entities.action.entity_rotated_action import EntityRotatedAction
from core.world.entities.action.entity_hp_changed_action import EntityHpChangedAction
from core.world.entities.action.entity_walk_action import EntityWalkAction
from core.world.entities.action.entity_got_in_nest_action import EntityGotInNestAction
from core.world.entities.action.ant_picked_up_item_action import AntPickedUpItemAction
from core.world.entities.action.nest_stored_calories_changed_action import NestStoredCaloriesChangedAction
from core.world.entities.action.nest_larvae_changed_action import NestLarvaeChangedAction
from core.world.entities.action.nest_build_status_changed_action import NestBuildStatusChangedAction
from core.world.entities.action.item_was_dropped_action import ItemWasDroppedAction
from core.world.entities.action.item_being_bringed_action import ItemBeingBringedAction
from core.world.entities.action.colony_born_action import ColonyBornAction
from core.world.entities.action.colony_operations_changed_action import ColonyOperationsChangedAction

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
                return self._serialize_entity_colony_changed(action)
            case ActionTypes.ENTITY_ROTATED:
                return self._serialize_entity_rotated(action)
            case ActionTypes.ENTITY_HP_CHANGED:
                return self._serialize_hp_changed(action)
            case ActionTypes.ENTITY_WALK:
                return self._serialize_entity_walk(action)
            case ActionTypes.ENTITY_GOT_IN_NEST:
                return self._serialize_entity_got_in_nest(action)
            case ActionTypes.ENTITY_GOT_OUT_OF_NEST:
                return self._default_action_serialize(action)
            case ActionTypes.ANT_PICKED_UP_ITEM:
                return self._serialize_ant_picked_up_item(action)
            case ActionTypes.ANT_DROPPED_PICKED_ITEM:
                return self._default_action_serialize(action)
            case ActionTypes.ANT_FLEW_NUPTIAL_FLIGHT:
                return self._default_action_serialize(action)
            case ActionTypes.NEST_STORED_CALORIES_CHANGED:
                return self._serialize_nest_stored_calories_changed(action)
            case ActionTypes.NEST_LARVAE_CHANGED:
                return self._serialize_nest_larvae_changed(action)
            case ActionTypes.NEST_BUILD_STATUS_CHANGED:
                return self._serialize_nest_build_status_changed(action)
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
    
    def _default_action_serialize(self, action: Action):
        json = self._serialize_common(action)
        
        return json
            
    def _serialize_entity_born(self, action: EntityBornAction):
        json = self._serialize_common(action)
        serialized_entity = self._entity_serializer.serialize(action.entity)
        json.update({
            'action_data': { 'entity': serialized_entity }
        })

        return json
    
    def _serialize_entity_colony_changed(self, action: EntityColonyChangedAction):
        json = self._serialize_common(action)
        json.update({
            'action_data': { 'colony_id': action.colony_id }
        })

        return json
    
    def _serialize_entity_rotated(self, action: EntityRotatedAction):
        json = self._serialize_common(action)
        json.update({
            'action_data': { 'angle': action.angle }
        })

        return json
    
    def _serialize_hp_changed(self, action: EntityHpChangedAction):
        json = self._serialize_common(action)
        json.update({
            'action_data': { 'hp': action.hp }
        })

        return json
    
    def _serialize_entity_walk(self, action: EntityWalkAction):
        json = self._serialize_common(action)
        serialized_position = self._util_serializer.serialize_point(action.position)
        json.update({
            'action_data': { 'position': serialized_position }
        })

        return json
    
    def _serialize_entity_got_in_nest(self, action: EntityGotInNestAction):
        json = self._serialize_common(action)

        json.update({
            'action_data': { 'nest_id': action.nest_id }
        })

        return json
    
    def _serialize_ant_picked_up_item(self, action: AntPickedUpItemAction):
        json = self._serialize_common(action)

        json.update({
            'action_data': { 'item_id': action.item_id }
        })

        return json
    
    def _serialize_nest_stored_calories_changed(self, action: NestStoredCaloriesChangedAction):
        json = self._serialize_common(action)

        json.update({
            'action_data': { 'stored_calories': action.stored_calories }
        })

        return json
    
    def _serialize_nest_larvae_changed(self, action: NestLarvaeChangedAction):
        json = self._serialize_common(action)

        serialized_larvae = []
        for larva in action.larvae:
            serialized_larvae.append(self._larva_serializer.serialize(larva))

        json.update({
            'action_data': { 'larvae': serialized_larvae }
        })

        return json
    
    def _serialize_nest_build_status_changed(self, action: NestBuildStatusChangedAction):
        json = self._serialize_common(action)

        json.update({
            'action_data': { 'is_built': action.is_built }
        })

        return json
    
    def _serialize_item_was_dropped(self, action: ItemWasDroppedAction):
        json = self._serialize_common(action)
        serialized_position = self._util_serializer.serialize_point(action.position)
        json.update({
            'action_data': { 'position': serialized_position }
        })

        return json
    
    def _serialize_item_being_bringed(self, action: ItemBeingBringedAction):
        json = self._serialize_common(action)
        serialized_new_position = self._util_serializer.serialize_point(action.new_position)
        json.update({
            'action_data': { 
                'new_position': serialized_new_position, 
                'bring_user_speed': action.bring_user_speed
            }
        })

        return json
    
    def _serialize_colony_born(self, action: ColonyBornAction):
        json = self._serialize_common(action)
        serialized_colony = self._colony_serializer.serialize(action.colony)
        json.update({
            'action_data': {
                'colony': serialized_colony
            }
        })

        return json
    
    def _serialize_operations_changed(self, action: ColonyOperationsChangedAction):
        json = self._serialize_common(action)

        serialized_operations = []
        for operation in action.operations:
            serialized_operations.append(self._operation_serializer.serialize(operation))

        json.update({
            'action_data': {
                'operations': serialized_operations
            }
        })

        return json
    
    