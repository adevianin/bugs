from core.world.entities.base.entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.entities.base.plain_entity import PlainEntity
from core.world.entities.items.base.item_types import ItemTypes

class Item(PlainEntity):

    def __init__(self, events: EventEmitter, id: int, item_type: ItemTypes, position: Point, strength: int, variety: int, is_picked: bool):
        super().__init__(events, id, EntityTypes.ITEM, None, Item.MAX_HP, position)
        self._item_type = item_type
        self._is_picked = is_picked
        self._variety = variety
        self._strength = strength

    @property
    def item_type(self):
        return self._item_type
    
    @property
    def is_picked(self):
        return self._is_picked
    
    @property
    def variety(self):
        return self._variety
    
    @property
    def strength(self):
        return self._strength
    
    def use(self, using_strength: int = None) -> int:
        if (using_strength is None):
            using_strength = self._strength
        used_strength = using_strength if self._strength > using_strength else self._strength
        self._strength -= used_strength
        if self._strength == 0:
            self.die()

        return used_strength
    
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
            'variety': self._variety
        })
        
        return json