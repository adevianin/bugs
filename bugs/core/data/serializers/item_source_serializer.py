from .base.plain_entity_serializer import PlainEntitySerializer
from core.world.entities.item.item_source import ItemSource

class ItemSourceSerializer(PlainEntitySerializer):

    def serialize(self, item_source: ItemSource):
        json = super().serialize(item_source)

        json.update({
            'item_type': item_source.item_type,
            'fertility': item_source.fertility,
            'accumulated': item_source.accumulated,
            'min_item_strength': item_source.min_item_strength,
            'max_item_strength': item_source.max_item_strength
        })

        return json