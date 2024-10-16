from core.world.entities.item.item_areas.item_area_factory import ItemAreaFactory
from core.world.utils.size import Size
from core.world.entities.item.items.base.item_types import ItemTypes
from .base.entity_deserializer import EntityDeserializer

class ItemAreaDeserializer(EntityDeserializer):

    def __init__(self, item_area_factory: ItemAreaFactory):
        self._item_area_factory = item_area_factory

    def deserialize_item_area(self, item_area_json: dict):
        props = self._parse_props(item_area_json)
        return self._item_area_factory.build_item_area(**props)
    
    def _parse_props(self, json: dict): 
        props = self.parse_entity_props(json)
        props.update({
            'size': Size.from_json(json['position']),
            'item_type': ItemTypes(json['item_type']),
            'fertility': json['fertility'],
            'accumulated': json['accumulated']
        })
        return props