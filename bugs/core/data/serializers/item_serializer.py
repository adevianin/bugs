from .base.entity_serializer import EntitySerializer
from core.world.entities.items.base.item import Item
from core.world.entities.items.base.edible_item import EdibleItem
from core.world.entities.items.base.item_types import ItemTypes
from core.world.entities.items.items.leaf_item import LeafItem
from core.world.entities.items.items.honeydew_item import HoneydewItem
from core.world.entities.items.items.flower_item import FlowerItem

class ItemSerializer(EntitySerializer):

    def serialize(self, item: Item):
        json = super().serialize(item)
        match(item.item_type):
            case ItemTypes.LEAF:
                item_json = self._serialize_leaf(item)
            case ItemTypes.HONEYDEW:
                item_json = self._serialize_honeydew(item)
            case ItemTypes.FLOWER:
                item_json = self._serialize_flower(item)
            case _:
                raise Exception('unknown type of item')
            
        json.update(item_json)
        return json

    def _serialize_item_base(self, item: Item):
        return {
            'item_type': item.item_type,
            'is_picked': item.is_picked,
            'item_variety': item.item_variety
        }
    
    def _serialize_edible_item_base(self, item: EdibleItem):
        json = self._serialize_item_base(item)
        json.update({
            'calories': item.calories
        })

        return json
            
    def _serialize_leaf(self, leaf: LeafItem):
        return self._serialize_edible_item_base(leaf)
    
    def _serialize_honeydew(self, leaf: HoneydewItem):
        return self._serialize_edible_item_base(leaf)
    
    def _serialize_flower(self, leaf: FlowerItem):
        return self._serialize_item_base(leaf)