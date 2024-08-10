from core.world.entities.colony.colonies.ant_colony.formation.formation_factory import FormationFactory
from core.world.entities.colony.colonies.ant_colony.formation.base.formation_types import FormationTypes
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
            case _:
                raise Exception('unknown type of formation')
            
    def _build_bring_item_formation(self, json: dict, entities_collection: EntityCollection):
        units = entities_collection.get_entities(json['units_ids'])
        dest_point = Point.from_json(json['destination'])
        item = entities_collection.get_entity_by_id(json['item_id'])
        is_activated = json['is_activated']
        return self._formation_factory.build_bring_item_formation(units, dest_point, is_activated, item)
    
    def _build_attack_formation(self, json: dict, entities_collection: EntityCollection):
        units = entities_collection.get_entities(json['units_ids'])
        dest_point = Point.from_json(json['destination'])
        is_activated = json['is_activated']
        return self._formation_factory.build_attack_formation(units, dest_point, is_activated)
    