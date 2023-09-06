from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from .item_types import ItemTypes
from .item import Item
from core.world.entities.base.body import Body

import random

class ItemFactory():

    def build_new_item(self, id: int, item_type: ItemTypes, position: Point, strength: int) -> Item:
        variety = Item.generate_item_variety(item_type)
        life_span = Item.generate_life_span(item_type)
        return self.build_item(id, item_type, position, 0, strength, variety, life_span, False)

    def build_item(self, id: int, item_type: ItemTypes, position: Point, angle: int, strength: int, variety: int, life_span: int, is_picked: bool) -> Item:
        events = EventEmitter()
        body = Body(events, position, angle, Body.MAX_HP)
        return Item(events, id, body, item_type, strength, variety, life_span, is_picked)
            