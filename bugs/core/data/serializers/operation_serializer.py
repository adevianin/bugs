from core.world.entities.colony.colonies.ant_colony.operation.base.operation import Operation
from core.world.entities.colony.colonies.ant_colony.operation.base.operation_types import OperationTypes
from core.world.entities.colony.colonies.ant_colony.operation.build_new_sub_nest_operation import BuildNewSubNestOperation
from core.world.entities.colony.colonies.ant_colony.operation.destroy_nest_operation import DestroyNestOperation
from core.world.entities.colony.colonies.ant_colony.operation.bring_bug_corpse_to_nest_operation import BringBugCorpseToNestOperation
from core.world.entities.colony.colonies.ant_colony.operation.pillage_nest_operation import PillageNestOperation
from core.world.entities.colony.colonies.ant_colony.operation.transport_food_operation import TransportFoodOperation
from core.world.entities.colony.colonies.ant_colony.operation.build_fortification_operation import BuildFortificationOperation
from core.data.serializers.formation_serializer import FormationSerializer
from .fight_serializer import FightSerializer

class OperationSerializer():

    def __init__(self, formation_serializer: FormationSerializer, fight_serializer: FightSerializer):
        self._formation_serializer = formation_serializer
        self._fight_serializer = fight_serializer

    def serialize(self, operation: Operation):
        match(operation.type):
            case OperationTypes.BUILD_NEW_SUB_NEST:
                return self._serialize_build_new_sub_nest(operation)
            case OperationTypes.DESTROY_NEST:
                return self._serialize_destroy_nest(operation)
            case OperationTypes.BRING_BUG_CORPSE_TO_NEST:
                return self._serialize_bring_bug_corpse_to_nest(operation)
            case OperationTypes.PILLAGE_NEST:
                return self._serialize_pillage_nest(operation)
            case OperationTypes.TRANSPORT_FOOD:
                return self._serialize_transport_food(operation)
            case OperationTypes.BUILD_FORTIFICATION:
                return self._serialize_build_fortification(operation)
            case _:
                raise Exception('unknown type of operation')

    def _serialize_operation_props(self, operation: Operation):
        return {
            'id': operation.id,
            'hired_ants': [ant.id for ant in operation.get_hired_ants()],
            'flags': operation.flags,
            'type': operation.type,
            'formation': self._formation_serializer.serialize(operation.formation) if operation.formation else None,
            'fight': self._fight_serializer.serialize(operation.fight) if operation.fight else None,
            'worker_vacancies_count': operation.worker_vacancies_count,
            'warrior_vacancies_count': operation.warrior_vacancies_count
        }

    def _serialize_build_new_sub_nest(self, operation: BuildNewSubNestOperation):
        json = self._serialize_operation_props(operation)
        json.update({
            'building_site': operation.building_site,
            'building_nest_id': operation.building_nest_id
        })

        return json
    
    def _serialize_destroy_nest(self, operation: DestroyNestOperation):
        json = self._serialize_operation_props(operation)

        json.update({
            'nest_id': operation.nest_id
        })

        return json
    
    def _serialize_bring_bug_corpse_to_nest(self, operation: BringBugCorpseToNestOperation):
        json = self._serialize_operation_props(operation)

        json.update({
            'nest_id': operation.nest_id,
            'search_bug_corpse_location': operation.search_bug_corpse_location,
            'found_bug_corpse_item_id': operation.found_bug_corpse_item_id
        })

        return json
    
    def _serialize_pillage_nest(self, operation: PillageNestOperation):
        json = self._serialize_operation_props(operation)

        json.update({
            'nest_to_pillage_id': operation.nest_to_pillage_id,
            'nest_for_loot_id': operation.nest_for_loot_id
        })

        return json
    
    def _serialize_transport_food(self, operation: TransportFoodOperation):
        json = self._serialize_operation_props(operation)

        json.update({
            'nest_from_id': operation.nest_from_id,
            'nest_to_id': operation.nest_to_id
        })

        return json
    
    def _serialize_build_fortification(self, operation: BuildFortificationOperation):
        json = self._serialize_operation_props(operation)

        json.update({
            'nest_id': operation.nest_id
        })

        return json
