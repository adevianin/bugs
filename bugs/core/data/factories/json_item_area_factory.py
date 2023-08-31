from core.world.entities.items.item_area_factory import ItemAreaFactory
from core.world.utils.point import Point
from core.world.utils.size import Size
from core.world.entities.items.base.item_types import ItemTypes

class JsonItemAreaFactory():

    def __init__(self, item_area_factory: ItemAreaFactory):
        self._item_area_factory = item_area_factory

    def build_item_area_from_json(self, item_area_json: dict):
        id = item_area_json['id']
        from_colony_id = item_area_json['from_colony_id']
        hp = item_area_json['hp']
        position = Point.from_json(item_area_json['position'])
        size = Size.from_json(item_area_json['position'])
        item_type = ItemTypes(item_area_json['item_type'])
        fertility = item_area_json['fertility']
        accumulated = item_area_json['accumulated']
        return self._item_area_factory.build_item_area(id, from_colony_id, hp, position, size, item_type, fertility, accumulated)