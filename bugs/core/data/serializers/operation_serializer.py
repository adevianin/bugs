from core.world.entities.colony.colonies.ant_colony.operation.base.operation import Operation
from core.world.entities.colony.colonies.ant_colony.operation.base.operation_types import OperationTypes
from core.world.entities.colony.colonies.ant_colony.operation.build_new_sub_nest_operation import BuildNewSubNestOperation
from core.world.entities.colony.colonies.ant_colony.operation.destroy_nest_operation import DestroyNestOperation
from core.world.entities.colony.colonies.ant_colony.operation.bring_item_to_nest_operation import BringItemToNestOperation
from core.world.entities.colony.colonies.ant_colony.operation.pillage_nest_operation import PillageNestOperation
from core.world.entities.colony.colonies.ant_colony.operation.transport_food_operation import TransportFoodOperation
from core.world.entities.colony.colonies.ant_colony.operation.build_fortification_operation import BuildFortificationOperation
from core.data.serializers.formation_serializer import FormationSerializer

class OperationSerializer():

    def __init__(self, formation_serializer: FormationSerializer):
        self._formation_serializer = formation_serializer

    def serialize(self, operation: Operation):
        match(operation.type):
            case OperationTypes.BUILD_NEW_SUB_NEST:
                return self._serialize_build_new_sub_nest(operation)
            case OperationTypes.DESTROY_NEST:
                return self._serialize_destroy_nest(operation)
            case OperationTypes.BRING_ITEM_TO_NEST:
                return self._serialize_bring_item_to_nest(operation)
            case OperationTypes.PILLAGE_NEST:
                return self._serialize_pillage_nest(operation)
            case OperationTypes.TRANSPORT_FOOD:
                return self._serialize_transport_food(operation)
            case OperationTypes.BUILD_FORTIFICATION:
                return self._serialize_build_fortification(operation)
            case _:
                raise Exception('unknown type of operation')

    def _serialize_operation(self, operation: Operation):
        return {
            'id': operation.id,
            'hired_ants': [ant.id for ant in operation.get_hired_ants()],
            'flags': operation.flags,
            'type': operation.type,
            'formations': [self._formation_serializer.serialize(formation) for formation in operation.formations]
        }

    def _serialize_build_new_sub_nest(self, operation: BuildNewSubNestOperation):
        json = self._serialize_operation(operation)
        json.update({
            'building_site': operation.building_site,
            'workers_count': operation.workers_count
        })

        return json
    
    def _serialize_destroy_nest(self, operation: DestroyNestOperation):
        json = self._serialize_operation(operation)

        json.update({
            'nest_id': operation.nest_id,
            'warriors_count': operation.warriors_count
        })

        return json
    
    def _serialize_bring_item_to_nest(self, operation: BringItemToNestOperation):
        json = self._serialize_operation(operation)

        json.update({
            'nest_id': operation.nest_id,
            'item_id': operation.item_id
        })

        return json
    
    def _serialize_pillage_nest(self, operation: PillageNestOperation):
        json = self._serialize_operation(operation)

        json.update({
            'nest_to_pillage_id': operation.nest_to_pillage_id,
            'nest_for_loot_id': operation.nest_for_loot_id,
            'warriors_count': operation.warriors_count,
            'workers_count': operation.workers_count
        })

        return json
    
    def _serialize_transport_food(self, operation: TransportFoodOperation):
        json = self._serialize_operation(operation)

        json.update({
            'nest_from_id': operation.nest_from_id,
            'nest_to_id': operation.nest_to_id,
            'workers_count': operation.workers_count,
            'warriors_count': operation.warriors_count
        })

        return json
    
    def _serialize_build_fortification(self, operation: BuildFortificationOperation):
        json = self._serialize_operation(operation)

        json.update({
            'nest_id': operation.nest_id,
            'workers_count': operation.workers_count
        })

        return json
