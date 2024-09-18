from core.world.entities.colony.colonies.ant_colony.operation.base.formation.formation_factory import FormationFactory
from core.world.entities.colony.colonies.ant_colony.operation.base.formation.base.formation_types import FormationTypes
from core.world.entities.colony.colonies.ant_colony.operation.base.formation.base.base_formation import FormationState
from core.world.entities.base.entity_collection import EntityCollection
from core.world.utils.point import Point

class FormationDeserializer():

    def __init__(self, formation_factory: FormationFactory):
        self._formation_factory = formation_factory

    def deserialize_formation(self, json: dict, entities_collection: EntityCollection):
        match(json['type']):
            case FormationTypes.ATTACK:
                return self._build_attack_formation(json, entities_collection)
            case FormationTypes.BRING_ITEM:
                return self._build_bring_item_formation(json, entities_collection)
            case FormationTypes.CONVOY:
                return self._build_convoy_formation(json, entities_collection)
            case _:
                raise Exception('unknown type of formation')
            
    def _parse_common_params(self, json: dict, entities_collection: EntityCollection):
        return {
            'name': json['name'],
            'units': entities_collection.get_entities(json['units_ids']),
            'destination_point': Point.from_json(json['destination_point']),
            'current_position': Point.from_json(json['current_position']),
            'state': FormationState(json['state'])
        }
            
    def _build_bring_item_formation(self, json: dict, entities_collection: EntityCollection):
        params = self._parse_common_params(json, entities_collection)
        params.update({
            'item': entities_collection.get_entity_by_id(json['item_id'])
        })
        return self._formation_factory.build_bring_item_formation(**params)
    
    def _build_attack_formation(self, json: dict, entities_collection: EntityCollection):
        params = self._parse_common_params(json, entities_collection)
        return self._formation_factory.build_attack_formation(**params)
    
    def _build_convoy_formation(self, json: dict, entities_collection: EntityCollection):
        params = self._parse_common_params(json, entities_collection)
        return self._formation_factory.build_convoy_formation(**params)
    