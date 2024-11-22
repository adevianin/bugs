from core.world.entities.base.death_record.base_death_record import BaseDeathRecord
from core.world.entities.base.entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.entities.base.body import Body
from core.world.entities.base.entity import Entity
from core.world.entities.world.birthers.requests.item_birth_request import ItemBirthRequest
from core.world.entities.base.ownership_config import OwnershipConfig
from core.world.entities.world.season_types import SeasonTypes
from core.world.entities.action.item_source_fertility_changed_action import ItemSourceFertilityChangeAction

from typing import Callable, Dict, List
import random

class ItemSource(Entity):

    ACTIVE_SEASONS = []

    @classmethod
    def check_is_fertile_season(cls, season: SeasonTypes):
        return season in cls.ACTIVE_SEASONS

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, ownership: OwnershipConfig, body: Body, item_type: ItemTypes, 
                 fertility: int, accumulated: int, min_item_strength: int, max_item_strength: int, is_active: bool):
        super().__init__(event_bus, events, id, EntityTypes.ITEM_SOURCE, ownership, body)
        self._item_type = item_type
        # move fertility to body
        self._fertility = fertility
        self._accumulated = accumulated
        self._max_item_strength = max_item_strength
        self._min_item_strength = min_item_strength
        self._is_active = is_active
        self._is_fertile = self._check_fertility()

        self.events.add_listener('hp_changed', self._on_hp_changed)

        self._event_bus.add_listener('season_changed', self._on_season_changed)

    @property
    def item_type(self):
        return self._item_type
    
    @property
    def fertility(self):
        return self._fertility
    
    @property
    def is_fertile(self):
        return self._is_fertile
    
    @property
    def is_active(self):
        return self._is_active
    
    @is_fertile.setter
    def is_fertile(self, is_fertile: bool):
        is_changed = self._is_fertile != is_fertile
        self._is_fertile = is_fertile
        if is_fertile:
            self._accumulated = 0
        if is_changed:
            self._emit_action(ItemSourceFertilityChangeAction(self.id, self.is_fertile))
    
    @property
    def accumulated(self):
        return self._accumulated
    
    @property
    def max_item_strength(self):
        return self._max_item_strength
    
    @property
    def min_item_strength(self):
        return self._min_item_strength
    
    def _on_body_died(self, death_record: BaseDeathRecord):
        self._event_bus.remove_listener('season_changed', self._on_season_changed)
        super()._on_body_died(death_record)

    def take_some_item(self, on_item_ready: Callable) -> bool:
        min_strength = self._min_item_strength
        max_strength = min(self._max_item_strength, self._accumulated)

        if self._accumulated < min_strength or not self._is_fertile:
            return False

        strength = random.randint(min_strength, max_strength)

        self._accumulated -= strength

        self._event_bus.emit('item_birth_request', ItemBirthRequest(self._body.position, strength, self._item_type, 0, None, on_item_ready))

        return True

    def do_step(self):
        if self.is_fertile:
            self._accumulated += self._fertility

        self._body.restore_hp_step()

    def _on_hp_changed(self):
        super()._on_hp_changed()
        self._update_is_fertile()

    def _on_season_changed(self, season: SeasonTypes):
        self._is_active = self.check_is_fertile_season(season)
        self._update_is_fertile()

    def _check_fertility(self) -> bool:
        return self._body.hp > self._body.stats.max_hp / 3 and self._is_active
    
    def _update_is_fertile(self):
        self.is_fertile = self._check_fertility()

