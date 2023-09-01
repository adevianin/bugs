from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from .base.item_types import ItemTypes
from .base.item import Item

import random

class ItemFactory():

    def build_new_item(self, id: int, item_type: ItemTypes, position: Point, strength: int) -> Item:
        variety = Item.generate_item_variety(item_type)
        life_span = Item.generate_life_span(item_type)
        return self.build_item(id, item_type, position, strength, variety, life_span, False)

    def build_item(self, id: int, item_type: ItemTypes, position: Point, strength: int, variety: int, life_span: int, is_picked: bool) -> Item:
        events = EventEmitter()
        return Item(events, id, item_type, position, strength, variety, life_span, is_picked)
            