from core.world.entities.colony.colonies.ant_colony.operation.base.operation import Operation
from core.world.entities.colony.colonies.ant_colony.operation.base.operation_types import OperationTypes
from core.world.entities.colony.colonies.ant_colony.operation.build_new_sub_nest_operation import BuildNewSubNestOperation
from core.world.entities.colony.colonies.ant_colony.operation.destroy_nest_operation import DestroyNestOperation
from core.world.entities.colony.colonies.ant_colony.operation.bring_item_to_nest_operation import BringItemToNestOperation
from core.world.entities.colony.colonies.ant_colony.operation.pillage_nest_operation import PillageNestOperation
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
            case _:
                raise Exception('unknown type of operation')

    def _serialize_operation(self, operation: Operation):
        return {
            'id': operation.id,
            'hired': [ant.id for ant in operation.get_hired_ants()],
            'flags': operation.flags,
            'type': operation.type,
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

        attack_formation_json = self._formation_serializer.serialize(operation.attack_foration)

        json.update({
            'nest_id': operation.nest_id,
            'warriors_count': operation.warriors_count,
            'attack_formation': attack_formation_json
        })

        return json
    
    def _serialize_bring_item_to_nest(self, operation: BringItemToNestOperation):
        json = self._serialize_operation(operation)

        bring_item_formation_json = self._formation_serializer.serialize(operation.bring_item_formation)

        json.update({
            'nest_id': operation.nest_id,
            'item_id': operation.item_id,
            'bring_item_formation': bring_item_formation_json
        })

        return json
    
    def _serialize_pillage_nest(self, operation: PillageNestOperation):
        json = self._serialize_operation(operation)

        attack_formation_json = self._formation_serializer.serialize(operation.attack_formation)
        go_home_formation_json = self._formation_serializer.serialize(operation.go_home_formation)

        json.update({
            'nest_to_pillage_id': operation.nest_to_pillage_id,
            'nest_to_unload_id': operation.nest_to_unload_id,
            'attack_formation': attack_formation_json,
            'go_home_formation': go_home_formation_json
        })

        return json
