from core.world.entities.item.items.item_factory import ItemFactory
from core.world.entities.item.items.base.item_types import ItemTypes
from .base.entity_deserializer import EntityDeserializer

class ItemDeserializer(EntityDeserializer):

    def __init__(self, item_factory: ItemFactory):
        self._item_factory = item_factory

    def deserialize_item(self, item_json: dict):
        props = self._parse_props(item_json)
        return self._item_factory.build_item(**props)
    
    def _parse_props(self, item_json: dict):
        props = self.parse_entity_props(item_json)
        props.update({
            'item_type': ItemTypes(item_json['item_type']),
            'is_picked': item_json['is_picked'],
            'strength': item_json['strength'],
            'life_span': item_json['life_span'],
            'variety': item_json['variety']
        })
        return props
            