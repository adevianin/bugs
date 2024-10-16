from core.world.entities.base.entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.entities.base.body import Body
from core.world.entities.base.entity import Entity
from core.world.entities.world.birthers.requests.item_birth_request import ItemBirthRequest
from core.world.entities.base.ownership_config import OwnershipConfig

from typing import Callable
import random

class ItemSource(Entity):


    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, ownership: OwnershipConfig, body: Body, item_type: ItemTypes, fertility: int, accumulated: int, min_item_strength: int, max_item_strength: int):
        super().__init__(event_bus, events, id, EntityTypes.ITEM_SOURCE, ownership, body)
        self._item_type = item_type
        # move fertility to body
        self._fertility = fertility
        self._accumulated = accumulated
        self._max_item_strength = max_item_strength
        self._min_item_strength = min_item_strength
        self._is_fertile = self._check_fertility()

        self.events.add_listener('hp_changed', self._on_hp_changed)

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

        self._event_bus.emit('item_birth_request', ItemBirthRequest.build(self._body.position, strength, self._item_type, None, on_item_ready))

        return True

    def do_step(self):
        if self.is_fertile:
            self._accumulated += self._fertility

        self._body.restore_hp_step()

    def _on_hp_changed(self):
        self.is_fertile = self._check_fertility()

    def _on_fertility_changed(self):
        self.events.emit('action', 'item_source_fertility_changed', { 'is_fertile': self.is_fertile })
        if not self._is_fertile:
            self._accumulated = 0
        
    def _check_fertility(self) -> bool:
        return self._body.hp > self._body.stats.max_hp / 3
