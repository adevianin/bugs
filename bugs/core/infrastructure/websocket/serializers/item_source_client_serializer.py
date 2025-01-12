from core.world.entities.item.item_sources.base.item_source import ItemSource
from .base.entity_client_serializer import EntityClientSerializer

class ItemSourceClientSerializer(EntityClientSerializer):

    def serialize(self, item_source: ItemSource):
        json = super().serialize(item_source)
        json.update({
            'item_type': item_source.item_type,
            'is_fertile': item_source.is_fertile
        })

        return json