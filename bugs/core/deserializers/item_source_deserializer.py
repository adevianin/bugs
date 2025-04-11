from core.world.entities.item.item_sources.item_source_factory import ItemSourceFactory
from core.world.utils.point import Point
from core.world.entities.item.items.base.item_types import ItemTypes
from .base.entity_deserializer import EntityDeserializer

class ItemSourceDeserializer(EntityDeserializer):

    def __init__(self, item_source_factory: ItemSourceFactory):
        self._item_source_factory = item_source_factory

    def deserialize_item_source(self, item_source_factory_json: dict):
        props = self._parse_props(item_source_factory_json)
        return self._item_source_factory.build_item_source(**props)
    
    def _parse_props(self, item_source_factory_json: dict):
        props = self.parse_entity_props(item_source_factory_json)
        props.update({
            'item_type': ItemTypes(item_source_factory_json['item_type']),
            'fertility': item_source_factory_json['fertility'],
            'accumulated': item_source_factory_json['accumulated'],
            'max_item_strength': item_source_factory_json['max_item_strength'],
            'is_active': item_source_factory_json['is_active']
        })
        return props