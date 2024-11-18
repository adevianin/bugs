from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.entities.base.stats_library import StatsLibrary
from core.world.entities.base.ownership_config import OwnershipConfig
from .base.item_source_body import ItemSourceBody
from .base.item_source import ItemSource
from core.world.entities.world.season_types import SeasonTypes

class ItemSourceFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_new_item_source(self, id: int, position: Point, item_type: ItemTypes, fertility: int, min_item_strength: int, max_item_strength: int, current_season: SeasonTypes):
        ownership = OwnershipConfig.build_empty()
        hp = StatsLibrary.ITEM_SOURCE_DEFAULT.max_hp
        is_active = ItemSource.check_is_fertile_season_for_item_type(current_season, item_type)
        return self.build_item_source(id, ownership, hp, position, 0, item_type, fertility, 0, min_item_strength, max_item_strength, is_active)

    def build_item_source(self, id: int, ownership: OwnershipConfig, hp: int, position: Point, angle: int, item_type: ItemTypes, fertility: int, accumulated: int, 
                          min_item_strength: int, max_item_strength: int, is_active: bool):
        stats = StatsLibrary.ITEM_SOURCE_DEFAULT
        body = ItemSourceBody(EventEmitter(), stats, position, angle, hp)
        return ItemSource(self._event_bus, EventEmitter(), id, ownership, body, item_type, fertility, accumulated, min_item_strength, max_item_strength, is_active)
