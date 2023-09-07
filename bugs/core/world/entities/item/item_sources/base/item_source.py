from core.world.entities.base.entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.entities.base.body import Body
from core.world.entities.base.entity import Entity

from typing import Callable
import random

class ItemSource(Entity):


    def __init__(self, events: EventEmitter, id: int, from_colony_id: int, body: Body, item_type: ItemTypes, fertility: int, accumulated: int, min_item_strength: int, max_item_strength: int):
        super().__init__(events, id, EntityTypes.ITEM_SOURCE, from_colony_id, body)
        self._item_type = item_type
        self._fertility = fertility
        self._accumulated = accumulated
        self._max_item_strength = max_item_strength
        self._min_item_strength = min_item_strength
        self._is_fertile = self._check_fertility()

    @property
    def item_type(self):
        return self._item_type
    
    @property
    def fertility(self):
        return self._fertility
    
    @property
    def is_fertile(self):
        return self._is_fertile
    
    @is_fertile.setter
    def is_fertile(self, is_fertile: bool):
        is_changed = self._is_fertile == is_fertile
        self._is_fertile = is_fertile
        if is_changed:
            self._on_fertility_changed()
    
    @property
    def accumulated(self):
        return self._accumulated
    
    @property
    def max_item_strength(self):
        return self._max_item_strength
    
    @property
    def min_item_strength(self):
        return self._min_item_strength

    def take_some_item(self, on_item_ready: Callable) -> bool:
        min_strength = self._min_item_strength
        max_strength = min(self._max_item_strength, self._accumulated)

        if self._accumulated < min_strength:
            return False

        strength = random.randint(min_strength, max_strength)

        self._accumulated -= strength

        self.events.emit('birth_request', {
            'entity_type': EntityTypes.ITEM,
            'item_type': self._item_type,
            'position': self._body.position,
            'strength': strength,
            'callback': on_item_ready
        })

        return True

    def do_step(self):
        if self.is_fertile:
            self._accumulated += self._fertility

        self._body.restore_hp_step()

    def to_public_json(self):
        json = super().to_public_json()
        json.update({
            'item_type': self._item_type,
            'is_fertile': self.is_fertile
        })
        
        return json
    
    def _on_hp_changed(self):
        super()._on_hp_changed()
        self.is_fertile = self._check_fertility()

    def _on_fertility_changed(self):
        self._emit_fertility_change()
        if not self._is_fertile:
            self._accumulated = 0
        
    def _emit_fertility_change(self):
        self._emit_action('item_source_fertility_changed', { 'is_fertile': self.is_fertile })

    def _check_fertility(self) -> bool:
        return self._body.hp > self._body.MAX_HP / 3
