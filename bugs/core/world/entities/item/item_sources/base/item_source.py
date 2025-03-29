from core.world.entities.base.death_record.base_death_record import BaseDeathRecord
from core.world.entities.base.entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.entities.base.body import Body
from core.world.entities.base.entity import Entity
from core.world.entities.world.birth_requests.item_birth_request import ItemBirthRequest
from core.world.entities.base.ownership_config import OwnershipConfig
from core.world.entities.world.season_types import SeasonTypes
from .item_source_body import ItemSourceBody
from core.world.entities.action.item_source_is_damaged_changed_action import ItemSourceIsDamagedChangedAction
from core.world.entities.action.item_source_accumulated_changed_action import ItemSourceAccumulatedChangedAction

from typing import Callable

class ItemSource(Entity):

    ACTIVE_SEASONS = []

    _body: ItemSourceBody

    @classmethod
    def check_is_fertile_season(cls, season: SeasonTypes):
        return season in cls.ACTIVE_SEASONS

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, ownership: OwnershipConfig, body: Body, item_type: ItemTypes):
        super().__init__(event_bus, events, id, EntityTypes.ITEM_SOURCE, ownership, body)
        self._item_type = item_type

        self._event_bus.add_listener('season_changed', self._on_season_changed)
        self._body.events.add_listener('is_damaged_changed', self._on_is_damaged_changed)
        self._body.events.add_listener('accumulated_changed', self._on_accumulated_changed)

    @property
    def item_type(self):
        return self._item_type
    
    @property
    def fertility(self):
        return self._body.fertility
    
    @property
    def is_damaged(self):
        return self._body.is_damaged
    
    @property
    def is_active(self):
        return self._body.is_active
    
    @property
    def accumulated(self):
        return self._body.accumulated
    
    @property
    def max_item_strength(self):
        return self._body.max_item_strength
    
    @property
    def max_accumulated(self):
        return self._body.max_accumulated
    
    def _on_body_died(self, death_record: BaseDeathRecord):
        self._event_bus.remove_listener('season_changed', self._on_season_changed)
        super()._on_body_died(death_record)

    def take_some_item(self, on_item_ready: Callable) -> bool:
        if not self._body.check_can_pull_item_strength():
            return False
        strength = self._body.pull_item_strength()
        self._event_bus.emit('item_birth_request', ItemBirthRequest(self._body.position, strength, self._item_type, 0, None, on_item_ready))
        return True

    def do_step(self):
        self._body.produce()
        self._body.restore_hp_step()

    def _on_season_changed(self, season: SeasonTypes):
        self._body.is_active = self.check_is_fertile_season(season)

    def _on_is_damaged_changed(self):
        self._emit_action(ItemSourceIsDamagedChangedAction(self.id, self.is_damaged))

    def _on_accumulated_changed(self):
        self._emit_action(ItemSourceAccumulatedChangedAction(self.id, self.accumulated))
