from core.world.entities.item.item_areas.base.item_area import ItemArea
from .base.entity_client_serializer import EntityClientSerializer

class ItemAreaClientSerializer(EntityClientSerializer):

    def serialize(self, item_area: ItemArea):
        json = super().serialize(item_area)

        return json