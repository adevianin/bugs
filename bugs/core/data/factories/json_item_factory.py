from core.world.entities.items.item_factory import ItemFactory
from core.world.entities.items.base.item_types import ItemTypes
from core.world.utils.point import Point

class JsonItemFactory():

    def __init__(self, item_factory: ItemFactory):
        self._item_factory = item_factory

    def build_item_from_json(self, item_json: dict):
        match item_json['item_type']:
            case ItemTypes.LEAF:
                return self._build_leaf_item(item_json)
            case ItemTypes.HONEYDEW:
                return self._build_honeydew_item(item_json)
            case ItemTypes.FLOWER:
                return self._build_flower_item(item_json)
            case _:
                raise Exception('unknown type of item')
            
    def _build_flower_item(self, item_json: dict):
        id = item_json['id']
        position = Point.from_json(item_json['position'])
        is_picked = item_json['is_picked']
        item_variety = item_json['item_variety']
        return self._item_factory.build_flower_item(id, position, is_picked, item_variety)
            
    def _build_honeydew_item(self, item_json: dict):
        id = item_json['id']
        position = Point.from_json(item_json['position'])
        is_picked = item_json['is_picked']
        item_variety = item_json['item_variety']
        calories = item_json['calories']
        return self._item_factory.build_honeydew_item(id, position, is_picked, item_variety, calories)

    def _build_leaf_item(self, item_json: dict):
        id = item_json['id']
        position = Point.from_json(item_json['position'])
        is_picked = item_json['is_picked']
        item_variety = item_json['item_variety']
        calories = item_json['calories']
        return self._item_factory.build_leaf_item(id, position, is_picked, item_variety, calories)