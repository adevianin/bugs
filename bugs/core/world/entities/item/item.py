from core.world.entities.base.entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.entities.item.item_types import ItemTypes
from core.world.entities.base.body import Body
from core.world.entities.base.entity import Entity

import random

class Item(Entity):

    @classmethod
    def generate_item_variety(cls, item_type: ItemTypes):
        match(item_type):
            case ItemTypes.LEAF:
                return random.randint(1, 4)
            case ItemTypes.FLOWER:
                return random.randint(1, 3)
            case ItemTypes.HONEYDEW:
                return 1
            case _:
                return 1
    
    @classmethod
    def generate_life_span(cls, item_type: ItemTypes):
        match(item_type):
            case ItemTypes.LEAF:
                return 100
            case ItemTypes.FLOWER:
                return 50
            case ItemTypes.HONEYDEW:
                return 5
            case _:
                return -1

    def __init__(self, events: EventEmitter, id: int, body: Body, item_type: ItemTypes, strength: int, variety: int, life_span: int, is_picked: bool):
        super().__init__(events, id, EntityTypes.ITEM, None, body)
        self._item_type = item_type
        self._is_picked = is_picked
        self._variety = variety
        self._strength = strength
        self._life_span = life_span
        self._is_bringing = False

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
    
    @property
    def life_span(self):
        return self._life_span
    
    def do_step(self):
        if self._life_span != -1:
            self._life_span -= 1
            if self._life_span == 0 and not self._is_picked and not self._is_bringing:
                self.die()

        if self._is_bringing:
            self.be_bringed()
        
    
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
        self._body.position = position
        self._emit_action('item_was_dropped', {
            'position': self.position.to_public_json()
        })

    def be_bringed_to(self, position: Point, bringer_speed: int):
        self._body.position = position
        self._emit_action('being_bringed', {
            'new_position': self._body.position.to_public_json(),
            'bring_user_speed': bringer_speed
        })

    def to_public_json(self):
        json = super().to_public_json()
        json.update({
            'item_type': self._item_type,
            'is_picked': self._is_picked,
            'variety': self._variety
        })
        
        return json