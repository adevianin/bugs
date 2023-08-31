from core.world.entities.base.entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.entities.base.plain_entity import PlainEntity
from core.world.entities.items.base.item_types import ItemTypes

import random
 
class Item(PlainEntity):

    ITEM_VARIETIES_COUNT = 1

    @classmethod
    def generate_random_item_variety(cls):
        return random.randint(1, cls.ITEM_VARIETIES_COUNT)

    def __init__(self, events: EventEmitter, id: int, item_type: ItemTypes, position: Point, is_picked: bool, item_variety: int):
        super().__init__(events, id, EntityTypes.ITEM, None, Item.MAX_HP, position)
        self._item_type = item_type
        self._is_picked = is_picked
        self._item_variety = item_variety

    @property
    def item_type(self):
        return self._item_type
    
    @property
    def is_picked(self):
        return self._is_picked
    
    @property
    def item_variety(self):
        return self._item_variety
    
    def pickup(self):
        self._is_picked = True
        self._emit_action('item_was_picked_up')

    def drop(self, position: Point):
        self._is_picked = False
        self.position = position
        self._emit_action('item_was_dropped', {
            'position': self.position.to_public_json()
        })

    def to_public_json(self):
        json = super().to_public_json()
        json.update({
            'item_type': self._item_type,
            'is_picked': self._is_picked,
            'item_variety': self._item_variety
        })
        
        return json