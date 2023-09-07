from .base.entity_serializer import EntitySerializer
from core.world.entities.item.item_areas.base.item_area import ItemArea

class ItemAreaSerializer(EntitySerializer):

    def serialize(self, item_area: ItemArea):
        json = super().serialize(item_area)

        json.update({
            'size': item_area.size,
            'item_type': item_area.item_type,
            'fertility': item_area.fertility,
            'accumulated': item_area.accumulated
        })

        return json