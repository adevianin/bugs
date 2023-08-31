from core.world.entities.items.base.item_types import ItemTypes
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.items.base.item_area import ItemArea

class FlowerItemArea(ItemArea):

    def _request_birth(self):
        self.events.emit('birth_request', {
            'entity_type': EntityTypes.ITEM,
            'item_type': ItemTypes.FLOWER,
            'position': self._generate_spawn_point()
        })