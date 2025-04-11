from core.world.entities.base.entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.entities.base.entity import Entity
from core.world.entities.action.item_was_picked_up_action import ItemWasPickedUpAction
from core.world.entities.action.item_was_dropped_action import ItemWasDroppedAction
from core.world.entities.action.item_being_bringed_action import ItemBeingBringedAction
from core.world.entities.action.item_bringing_state_changed_action import ItemBringingStateChangedAction
from .item_body import ItemBody
from core.world.entities.base.ownership_config import OwnershipConfig

import random

class Item(Entity):

    _body: ItemBody

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, body: ItemBody, item_type: ItemTypes, ownership: OwnershipConfig,
                 strength: int, variety: int, life_span: int, is_picked: bool):
        super().__init__(event_bus, events, id, EntityTypes.ITEM, ownership, body)
        self._item_type = item_type
        self._is_picked = is_picked
        self._variety = variety
        self._strength = strength
        self._life_span = life_span
        self._bringing_position = None
        self._bringing_dist_per_step = None

    @property
    def item_type(self):
        return self._item_type
    
    @property
    def is_picked(self):
        return self._is_picked
    
    @property
    def is_bringing(self):
        return self._bringing_position is not None
    
    @property
    def variety(self):
        return self._variety
    
    @property
    def strength(self):
        return self._strength
    
    @property
    def life_span(self):
        return self._life_span
    
    @property
    def is_detectable(self):
        return super().is_detectable and not self.is_picked and not self.is_bringing
    
    def do_step(self, step_number: int):
        if not self._is_picked and not self.is_bringing:
            self._life_span -= 1
            if self._life_span == 0:
                self.simple_die()

        if self.is_bringing:
            self._be_bringed()

    def use(self, using_strength: int = None) -> int:
        if (using_strength is None):
            using_strength = self._strength
        used_strength = using_strength if self._strength > using_strength else self._strength
        self._strength -= used_strength
        if self._strength == 0:
            self.simple_die()

        return used_strength
    
    def pickup(self):
        self._is_picked = True
        self._emit_action(ItemWasPickedUpAction.build(self.id))

    def drop(self, position: Point):
        self._almost_die()
        self._is_picked = False
        self._body.position = position
        self._emit_action(ItemWasDroppedAction.build(self.id, self.position))

    def setup_bringing(self, position: Point, bringing_dist_per_step: int):
        if (not self.is_bringing):
            self._emit_action(ItemBringingStateChangedAction(self.id, True))
        self._bringing_position = position
        self._bringing_dist_per_step = bringing_dist_per_step

    def clear_bringing(self):
        self._bringing_position = None
        self._bringing_dist_per_step = None
        self._emit_action(ItemBringingStateChangedAction(self.id, False))

    def _be_bringed(self):
        self._body.position = self._bringing_position
        self._emit_action(ItemBeingBringedAction(self.id, self._body.position, self._bringing_dist_per_step))

    def _almost_die(self):
        self._life_span = random.randint(3, 6)
