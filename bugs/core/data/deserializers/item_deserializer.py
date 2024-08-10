from core.world.entities.item.items.item_factory import ItemFactory
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.utils.point import Point

class ItemDeserializer():

    def __init__(self, item_factory: ItemFactory):
        self._item_factory = item_factory

    def deserialize_item(self, item_json: dict):
        id = item_json['id']
        item_type = ItemTypes(item_json['item_type'])
        position = Point.from_json(item_json['position'])
        angle = item_json['angle']
        is_picked = item_json['is_picked']
        strength = item_json['strength']
        life_span = item_json['life_span']
        variety = item_json['variety']
        return self._item_factory.build_item(id, item_type, position, angle, strength, variety, life_span, is_picked)
            