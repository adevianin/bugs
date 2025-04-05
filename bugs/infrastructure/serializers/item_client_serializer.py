from core.world.entities.item.items.base.item import Item
from .base.entity_client_serializer import EntityClientSerializer

class ItemClientSerializer(EntityClientSerializer):

    def serialize(self, item: Item):
        json = super().serialize(item)
        json.update({
            'itemType': item.item_type,
            'isPicked': item.is_picked,
            'variety': item.variety,
            'isBringing': item.is_bringing
        })

        return json