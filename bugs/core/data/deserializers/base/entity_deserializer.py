from core.world.utils.point import Point
from core.world.entities.base.ownership_config import OwnershipConfig

class EntityDeserializer():

    def parse_entity_props(self, json: dict) -> dict:
        return {
            "id": json['id'],
            "ownership": OwnershipConfig(json['from_colony_id'], json['owner_id']),
            "is_removal_blocked": json['is_removal_blocked'],
            "position": Point.from_json(json['position']),
            "angle": json['angle'],
            "hp": json['hp']
        }