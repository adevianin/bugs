from .base.entity_serializer import EntitySerializer
from core.world.entities.item.items.base.item import Item

class ItemSerializer(EntitySerializer):

    def serialize(self, item: Item):
        json = super().serialize(item)

        json.update({
            'item_type': item.item_type,
            'is_picked': item.is_picked,
            'variety': item.variety,
            'life_span': item.life_span,
            'strength': item.strength
        })
            
        return json
