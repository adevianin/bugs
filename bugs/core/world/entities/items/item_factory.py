from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from .base.item_types import ItemTypes
from .base.item import Item

import random

class ItemFactory():

    def build_new_item(self, id: int, item_type: ItemTypes, position: Point, strength: int) -> Item:
        variety = self._generate_item_variety(item_type)
        return self.build_item(id, item_type, position, strength, variety, False)

    def build_item(self, id: int, item_type: ItemTypes, position: Point, strength: int, variety: int, is_picked: bool) -> Item:
        events = EventEmitter()
        return Item(events, id, item_type, position, strength, variety, is_picked)

    def _generate_item_variety(self, item_type: ItemTypes):
        match(item_type):
            case ItemTypes.LEAF:
                return random.randint(1, 4)
            case ItemTypes.FLOWER:
                return random.randint(1, 3)
            case ItemTypes.HONEYDEW:
                return 1
            case _:
                return 1
            