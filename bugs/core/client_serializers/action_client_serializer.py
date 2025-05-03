from .util_client_serializer import UtilClientSerializer
from .common_entity_client_serializer import CommonEntityClientSerializer
from .larva_client_serializer import LarvaClientSerializer
from .egg_client_serializer import EggClientSerializer
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
from core.world.entities.action.nest_larva_fed_action import NestLarvaFedAction
from core.world.entities.action.nest_build_status_changed_action import NestBuildStatusChangedAction
from core.world.entities.action.item_was_dropped_action import ItemWasDroppedAction
from core.world.entities.action.item_being_bringed_action import ItemBeingBringedAction
from core.world.entities.action.item_bringing_state_changed_action import ItemBringingStateChangedAction
from core.world.entities.action.colony_born_action import ColonyBornAction
from core.world.entities.action.colony_died_action import ColonyDiedAction
from core.world.entities.action.ant_flew_nuptial_flight_back_action import AntFlewNuptialFlightBackAction
from core.world.entities.action.ant_flew_nuptial_flight_action import AntFlewNuptialFlightAction
from core.world.entities.action.nest_egg_develop import NestEggDevelopAction
from core.world.entities.action.nest_larva_is_ready_action import NestLarvaIsReadyAction
from core.world.entities.action.climate_temperature_change_action import ClimateTemperatureChangeAction
from core.world.entities.action.nest_fortification_changed_action import NestFortificationChangedAction
from core.world.entities.action.user_notification_action import UserNotificationAction
from core.world.entities.action.rating_updated_action import RatingUpdatedAction
from core.world.entities.action.nuptial_environment_males_changed_action import NuptialEnvironmentMalesChangedAction
from .notification_client_serializer import NotificationClientSerializer
from .nuptial_environment_client_serializer import NuptialEnvironmentClientSerializer
from core.world.entities.action.ant_home_nest_changed import AntHomeNestChangedAction
from core.world.utils.distance_per_step_to_user_speed import distance_per_step_to_user_speed
from core.world.entities.action.colony_operation_created_action import ColonyOperationCreatedAction
from core.world.entities.action.colony_operation_changed_action import ColonyOperationChangedAction
from core.world.entities.action.colony_operation_deleted_action import ColonyOperationDeletedAction
from core.world.entities.action.colony_enemies_changed_action import ColonyEnemiesChangedAction
from core.world.entities.action.nuptial_environment_specie_genes_changed_action import NuptialEnvironmentSpecieGenesChangedAction
from core.world.entities.action.entity_hibernation_status_chenged_action import EntityHibernationStatusChangedAction
from core.world.entities.action.ant_current_activity_changed_action import AntCurrentActivityChangedAction
from core.world.entities.action.ant_got_fertilized_action import AntGotFertilizedAction
from .genome_client_serializer import GenomeClientSerializer
from core.world.entities.action.item_source_is_damaged_changed_action import ItemSourceIsDamagedChangedAction
from core.world.entities.action.item_source_accumulated_changed_action import ItemSourceAccumulatedChangedAction
from core.world.entities.action.ant_hungry_state_changed_action import AntHungryStateChangedAction
from core.world.entities.action.nest_renamed_action import NestRenamedAction

class ActionClientSerializer():

    def __init__(self, common_entity_serializer: CommonEntityClientSerializer, util_serializer: UtilClientSerializer, larva_serializer: LarvaClientSerializer, egg_serializer: EggClientSerializer,
                 colony_serializer: ColonyClientSerializer, operation_serializer: OperationClientSerializer, notification_serializer: NotificationClientSerializer, 
                 nuptial_environment_serializer: NuptialEnvironmentClientSerializer, genome_client_serializer: GenomeClientSerializer):
        self._common_entity_serializer = common_entity_serializer
        self._util_serializer = util_serializer
        self._larva_serializer = larva_serializer
        self._egg_serializer = egg_serializer
        self._colony_serializer = colony_serializer
        self._operation_serializer = operation_serializer
        self._notification_serializer = notification_serializer
        self._nuptial_environment_serializer = nuptial_environment_serializer
        self._genome_client_serializer = genome_client_serializer

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
            case ActionTypes.ENTITY_HIBERNATION_STATUS_CHANGED:
                return self._serialize_hibernation_status_changed(action)
            case ActionTypes.ANT_PICKED_UP_ITEM:
                return self._serialize_ant_picked_up_item(action)
            case ActionTypes.ANT_DROPPED_PICKED_ITEM:
                return self._default_action_serialize(action)
            case ActionTypes.ANT_FLEW_NUPTIAL_FLIGHT:
                return self._serialize_ant_flew_nuptial_flight(action)
            case ActionTypes.ANT_FLEW_NUPTIAL_FLIGHT_BACK:
                return self._serialize_ant_flew_nuptial_flight_back(action)
            case ActionTypes.ANT_GOT_FERTILIZED:
                return self._serialize_ant_got_fertilized(action)
            case ActionTypes.ANT_HOME_NEST_CHANGED:
                return self._serialize_ant_home_nest_changed(action)
            case ActionTypes.ANT_CURRENT_ACTIVITY_CHANGED:
                return self._serialize_ant_current_activity_changed(action)
            case ActionTypes.ANT_HUNGRY_STATE_CHANGED:
                return self._serialize_ant_hungry_state_changed(action)
            case ActionTypes.NEST_STORED_CALORIES_CHANGED:
                return self._serialize_nest_stored_calories_changed(action)
            case ActionTypes.NEST_LARVA_FED:
                return self._serialize_nest_larva_fed(action)
            case ActionTypes.NEST_LARVA_IS_READY:
                return self._serialize_nest_larva_is_ready(action)
            case ActionTypes.NEST_EGG_DEVELOP:
                return self._serialize_nest_egg_develop(action)
            case ActionTypes.NEST_FORTIFICATION_CHANGED:
                return self._serialize_fortification_changed(action)
            case ActionTypes.NEST_BUILD_STATUS_CHANGED:
                return self._serialize_nest_build_status_changed(action)
            case ActionTypes.NEST_RENAMED:
                return self._serialize_nest_renamed(action)
            case ActionTypes.ITEM_WAS_PICKED_UP:
                return self._default_action_serialize(action)
            case ActionTypes.ITEM_WAS_DROPPED:
                return self._serialize_item_was_dropped(action)
            case ActionTypes.ITEM_BEING_BRINGED:
                return self._serialize_item_being_bringed(action)
            case ActionTypes.ITEM_BRINGING_STATE_CHANGED:
                return self._serialize_item_bringing_state_changed(action)
            case ActionTypes.ITEM_SOURCE_IS_DAMAGED_CHANGED:
                return self._serialize_item_source_is_damaged_changed(action)
            case ActionTypes.ITEM_SOURCE_ACCUMULATED_CHANGED:
                return self._serialize_item_source_accumulated_changed(action)
            case ActionTypes.COLONY_BORN:
                return self._serialize_colony_born(action)
            case ActionTypes.COLONY_DIED:
                return self._serialize_colony_died(action)
            case ActionTypes.COLONY_OPERATION_CREATED:
                return self._serialize_colony_operation_created(action)
            case ActionTypes.COLONY_OPERATION_CHANGED:
                return self._serialize_colony_operation_changed(action)
            case ActionTypes.COLONY_OPERATION_DELETED:
                return self._serialize_colony_operation_deleted(action)
            case ActionTypes.COLONY_ENEMIES_CHANGED:
                return self._serialize_colony_enemies_changed(action)
            case ActionTypes.CLIMATE_TEMPERATURE_CHANGE:
                return self._serialize_climate_temperature_changed(action)
            case ActionTypes.USER_NOTIFICATION:
                return self._serialize_user_notification(action)
            case ActionTypes.RATING_UPDATED:
                return self._serialize_rating_updated(action)
            case ActionTypes.NUPTIAL_ENVIRONMENT_MALES_CHANGED:
                return self._serialize_nuptial_environment_males_changed(action)
            case ActionTypes.NUPTIAL_ENVIRONMENT_SPECIE_GENES_CHANGED:
                return self._serialize_nuptial_environment_specie_genes_changed(action)
            case _:
                raise Exception('unknown type of action')
            
    def _serialize_common(self, action: Action):
        return  {
            'actorId': action.actor_id,
            'actorType': action.actor_type,
            'type': action.action_type
        }
    
    def _default_action_serialize(self, action: Action):
        json = self._serialize_common(action)
        
        return json
            
    def _serialize_entity_born(self, action: EntityBornAction):
        json = self._serialize_common(action)
        serialized_entity = self._common_entity_serializer.serialize(action.entity)
        json.update({
            'actionData': { 'entity': serialized_entity }
        })

        return json
    
    def _serialize_entity_colony_changed(self, action: EntityColonyChangedAction):
        json = self._serialize_common(action)
        json.update({
            'colonyId': action.colony_id
        })

        return json
    
    def _serialize_entity_rotated(self, action: EntityRotatedAction):
        json = self._serialize_common(action)
        json.update({
            'actionData': { 'angle': action.angle }
        })

        return json
    
    def _serialize_hp_changed(self, action: EntityHpChangedAction):
        json = self._serialize_common(action)
        json.update({
            'actionData': { 'hp': action.hp }
        })

        return json
    
    def _serialize_entity_walk(self, action: EntityWalkAction):
        json = self._serialize_common(action)
        serialized_position = self._util_serializer.serialize_point(action.position)
        json.update({
            'position': serialized_position,
            'userSpeed': distance_per_step_to_user_speed(action.distance_per_step)
        })

        return json
    
    def _serialize_entity_got_in_nest(self, action: EntityGotInNestAction):
        json = self._serialize_common(action)

        json.update({
            'actionData': { 'nest_id': action.nest_id }
        })

        return json
    
    def _serialize_hibernation_status_changed(self, action: EntityHibernationStatusChangedAction):
        json = self._serialize_common(action)

        json.update({
            'isInHibernation': action.is_in_hibernation
        })

        return json
    
    def _serialize_ant_picked_up_item(self, action: AntPickedUpItemAction):
        json = self._serialize_common(action)

        json.update({
            'actionData': { 'item_id': action.item_id }
        })

        return json
    
    def _serialize_ant_flew_nuptial_flight(self, action: AntFlewNuptialFlightAction):
        json = self._serialize_common(action)

        json.update({
            'isBornInNuptialFlight': action.is_born_in_nuptial_flight
        })

        return json
    
    def _serialize_ant_flew_nuptial_flight_back(self, action: AntFlewNuptialFlightBackAction):
        json = self._serialize_common(action)

        serialized_landing_position = self._util_serializer.serialize_point(action.landing_position)

        json.update({
            'landingPosition': serialized_landing_position
        })

        return json
    
    def _serialize_ant_got_fertilized(self, action: AntGotFertilizedAction):
        json = self._serialize_common(action)

        json.update({
            'breedingMaleGenome': self._genome_client_serializer.serialize_genome(action.breeding_male_genome)
        })

        return json
    
    def _serialize_ant_home_nest_changed(self, action: AntHomeNestChangedAction):
        json = self._serialize_common(action)

        json.update({
            'nestId': action.nest_id
        })

        return json
    
    def _serialize_ant_current_activity_changed(self, action: AntCurrentActivityChangedAction):
        json = self._serialize_common(action)

        json.update({
            'activity': action.activity
        })

        return json
    
    def _serialize_ant_hungry_state_changed(self, action: AntHungryStateChangedAction):
        json = self._serialize_common(action)

        json.update({
            'isHungry': action.is_hungry
        })

        return json
    
    def _serialize_nest_stored_calories_changed(self, action: NestStoredCaloriesChangedAction):
        json = self._serialize_common(action)

        json.update({
            'storedCalories': action.stored_calories
        })

        return json
    
    def _serialize_nest_larva_fed(self, action: NestLarvaFedAction):
        json = self._serialize_common(action)

        json.update({
            'larvaId': action.larva.id,
            'ateFood': action.larva.ate_food
        })

        return json
    
    def _serialize_nest_larva_is_ready(self, action: NestLarvaIsReadyAction):
        json = self._serialize_common(action)

        json.update({
            'larvaId': action.larva.id
        })

        return json
    
    def _serialize_nest_egg_develop(self, action: NestEggDevelopAction):
        json = self._serialize_common(action)

        json.update({
            'eggId': action.egg.id,
            'progress': action.egg.progress,
            'state': action.egg.state
        })

        return json
    
    def _serialize_fortification_changed(self, action: NestFortificationChangedAction):
        json = self._serialize_common(action)

        json.update({
            'fortification': action.fortification
        })

        return json
    
    def _serialize_nest_build_status_changed(self, action: NestBuildStatusChangedAction):
        json = self._serialize_common(action)

        json.update({
            'isBuilt': action.is_built
        })

        return json
    
    def _serialize_nest_renamed(self, action: NestRenamedAction):
        json = self._serialize_common(action)

        json.update({
            'name': action.name
        })

        return json
    
    def _serialize_item_was_dropped(self, action: ItemWasDroppedAction):
        json = self._serialize_common(action)
        serialized_position = self._util_serializer.serialize_point(action.position)
        json.update({
            'actionData': { 'position': serialized_position }
        })

        return json
    
    def _serialize_item_being_bringed(self, action: ItemBeingBringedAction):
        json = self._serialize_common(action)
        serialized_new_position = self._util_serializer.serialize_point(action.new_position)
        json.update({
            'new_position': serialized_new_position, 
            'bring_user_speed': distance_per_step_to_user_speed(action.bringing_dist_per_step)
        })

        return json
    
    def _serialize_item_bringing_state_changed(self, action: ItemBringingStateChangedAction):
        json = self._serialize_common(action)
        json.update({
            'isBringing': action.is_bringing, 
        })

        return json
    
    def _serialize_item_source_is_damaged_changed(self, action: ItemSourceIsDamagedChangedAction):
        json = self._serialize_common(action)
        json.update({
            'isDamaged': action.is_damaged, 
        })

        return json
    
    def _serialize_item_source_accumulated_changed(self, action: ItemSourceAccumulatedChangedAction):
        json = self._serialize_common(action)
        json.update({
            'accumulated': action.accumulated, 
        })

        return json
    
    def _serialize_colony_born(self, action: ColonyBornAction):
        json = self._serialize_common(action)
        serialized_colony = self._colony_serializer.serialize(action.colony)
        json.update({
            'actionData': {
                'colony': serialized_colony
            }
        })

        return json
    
    def _serialize_colony_died(self, action: ColonyDiedAction):
        json = self._serialize_common(action)
        return json
    
    def _serialize_colony_operation_created(self, action: ColonyOperationCreatedAction):
        json = self._serialize_common(action)
        json.update({
            'operation': self._operation_serializer.serialize(action.operation) 
        })
        return json
    
    def _serialize_colony_operation_changed(self, action: ColonyOperationChangedAction):
        json = self._serialize_common(action)
        json.update({
            'operation': self._operation_serializer.serialize(action.operation) 
        })
        return json
    
    def _serialize_colony_operation_deleted(self, action: ColonyOperationDeletedAction):
        json = self._serialize_common(action)
        json.update({
            'operationId': action.operation_id
        })
        return json
    
    def _serialize_colony_enemies_changed(self, action: ColonyEnemiesChangedAction):
        json = self._serialize_common(action)
        json.update({
            'enemies': action.enemies
        })
        return json
    
    def _serialize_climate_temperature_changed(self, action: ClimateTemperatureChangeAction):
        json = self._serialize_common(action)

        json.update({
            'dailyTemperature': action.daily_temperature,
            'directionOfChange': action.direction_of_change
        })

        return json
    
    def _serialize_user_notification(self, action: UserNotificationAction):
        json = self._serialize_common(action)

        json.update({
            'notification': self._notification_serializer.serialize(action.notification)
        })

        return json
    
    def _serialize_rating_updated(self, action: RatingUpdatedAction):
        json = self._serialize_common(action)

        json.update({
            'ratingPlaces': action.rating_places
        })

        return json
    
    def _serialize_nuptial_environment_males_changed(self, action: NuptialEnvironmentMalesChangedAction):
        json = self._serialize_common(action)

        json.update({
            'males': self._nuptial_environment_serializer.serialize_nuptial_males(action.males)
        })

        return json
    
    def _serialize_nuptial_environment_specie_genes_changed(self, action: NuptialEnvironmentSpecieGenesChangedAction):
        json = self._serialize_common(action)
        
        chromosome_genes_json = {}
        for specie_chromosome in action.specie_chromosome_set.specie_chromosomes:
            serialized_specie_genes = [self._nuptial_environment_serializer.serialize_specie_gene(specie_gene) for specie_gene in specie_chromosome.specie_genes]
            chromosome_genes_json[specie_chromosome.type] = serialized_specie_genes

        json.update({
            'chromosomeSpecieGenes': chromosome_genes_json
        })

        return json
    
    