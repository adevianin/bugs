from core.world.entities.item.item_source_factory import ItemSourceFactory
from core.world.utils.point import Point
from core.world.entities.item.item_types import ItemTypes

class JsonItemSourceFactory():

    def __init__(self, item_source_factory: ItemSourceFactory):
        self._item_source_factory = item_source_factory

    def build_item_source_from_json(self, item_source_factory_json: dict):
        id = item_source_factory_json['id']
        from_colony_id = item_source_factory_json['from_colony_id']
        hp = item_source_factory_json['hp']
        position = Point.from_json(item_source_factory_json['position'])
        item_type = ItemTypes(item_source_factory_json['item_type'])
        fertility = item_source_factory_json['fertility']
        accumulated = item_source_factory_json['accumulated']
        min_item_strength = item_source_factory_json['min_item_strength']
        max_item_strength = item_source_factory_json['max_item_strength']
        return self._item_source_factory.build_item_source(id, from_colony_id, hp, position, item_type, fertility, accumulated, min_item_strength, max_item_strength)