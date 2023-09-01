from core.world.entities.items.item_factory import ItemFactory
from core.world.entities.items.item_types import ItemTypes
from core.world.utils.point import Point

class JsonItemFactory():

    def __init__(self, item_factory: ItemFactory):
        self._item_factory = item_factory

    def build_item_from_json(self, item_json: dict):
        id = item_json['id']
        item_type = ItemTypes(item_json['item_type'])
        position = Point.from_json(item_json['position'])
        is_picked = item_json['is_picked']
        strength = item_json['strength']
        life_span = item_json['life_span']
        variety = item_json['variety']
        return self._item_factory.build_item(id, item_type, position, strength, variety, life_span, is_picked)
            