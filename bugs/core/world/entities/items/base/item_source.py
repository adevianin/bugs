from abc import abstractmethod
from core.world.entities.base.entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.entities.base.plain_entity import PlainEntity
from core.world.entities.items.base.item_types import ItemTypes

from typing import Callable

class ItemSource(PlainEntity):

    RESTORE_HP_PER_STEP = 0.05

    def __init__(self, events: EventEmitter, id: int, from_colony_id: int, hp: int, position: Point, item_type: ItemTypes, fertility: int, accumulated: int):
        super().__init__(events, id, EntityTypes.ITEM_SOURCE, from_colony_id, hp, position)
        self._item_type = item_type
        self._fertility = fertility
        self._accumulated = accumulated

    @property
    def item_type(self):
        return self._item_type
    
    @property
    def fertility(self):
        return self._fertility
    
    @property
    def accumulated(self):
        return self._accumulated
    
    @property
    @abstractmethod
    def is_fertile(self):
        pass

    @abstractmethod
    def take_some_item(self, on_food_ready: Callable) -> bool:
        pass

    def do_step(self):
        if self.is_fertile:
            self._accumulated += self._fertility

        is_fertile_before = self.is_fertile
        if self.hp < self.MAX_HP:
            self.hp += self.RESTORE_HP_PER_STEP
        if is_fertile_before != self.is_fertile:
            self._emit_fertility_change()

    def damage(self, damage: int):
        is_fertile_before = self.is_fertile

        if self.hp > damage:
            self.hp -= damage
        
        if not self.is_fertile:
            self.hp = 1
            self._accumulated = 0

        if is_fertile_before != self.is_fertile:
            self._emit_fertility_change()

    def to_public_json(self):
        json = super().to_public_json()
        json.update({
            'item_type': self._item_type,
            'is_fertile': self.is_fertile
        })
        
        return json

    def _emit_fertility_change(self):
        self._emit_action('item_source_fertility_changed', { 'is_fertile': self.is_fertile })
