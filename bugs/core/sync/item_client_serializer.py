from core.world.entities.item.items.base.item import Item
from .base.entity_client_serializer import EntityClientSerializer

class ItemClientSerializer(EntityClientSerializer):

    def serialize(self, item: Item):
        json = super().serialize(item)
        json.update({
            'item_type': item.item_type,
            'is_picked': item.is_picked,
            'variety': item.variety
        })

        return json