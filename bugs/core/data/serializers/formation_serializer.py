from core.world.entities.colony.colonies.ant_colony.formation.base.base_formation import BaseFormation
from core.world.entities.colony.colonies.ant_colony.formation.base.formation_types import FormationTypes
from core.world.entities.colony.colonies.ant_colony.formation.bring_item_formation import BringItemFormation
from core.world.entities.colony.colonies.ant_colony.formation.attack_formation import AttackFormation

class FormationSerializer():

    def serialize(self, formation: BaseFormation):
        match(formation.type):
            case FormationTypes.ATTACK:
                return self._serialize_attack_formation(formation)
            case FormationTypes.BRING_ITEM:
                return self._serialize_bring_item_formation(formation)
            case _:
                raise Exception('unknown type of formation')

    def _serialize_base_formation(self, formation: BaseFormation):
        return {
            'type': formation.type,
            'units_ids': formation.units_ids,
            'position': formation.position,
            'destination': formation.destination,
            'is_activated': formation.is_activated
        }
    
    def _serialize_bring_item_formation(self, formation: BringItemFormation):
        json = self._serialize_base_formation(formation)

        json.update({
            'item_id': formation.item_id
        })

        return json
    
    def _serialize_attack_formation(self, formation: AttackFormation):
        json = self._serialize_base_formation(formation)

        return json