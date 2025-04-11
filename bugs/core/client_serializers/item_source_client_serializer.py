from core.world.entities.item.item_sources.base.item_source import ItemSource
from .base.entity_client_serializer import EntityClientSerializer

class ItemSourceClientSerializer(EntityClientSerializer):

    def serialize(self, item_source: ItemSource):
        json = super().serialize(item_source)
        json.update({
            'itemType': item_source.item_type,
            'isDamaged': item_source.is_damaged,
            'accumulated': item_source.accumulated,
            'maxAccumulated': item_source.max_accumulated,
            'fertility': item_source.fertility
        })

        return json