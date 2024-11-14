from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.entities.base.stats_library import StatsLibrary
from core.world.entities.base.ownership_config import OwnershipConfig
from .base.item_source_body import ItemSourceBody
from .base.item_source import ItemSource

class ItemSourceFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_item_source(self, id: int, ownership: OwnershipConfig, hp: int, position: Point, angle: int, item_type: ItemTypes, fertility: int, accumulated: int, 
                          min_item_strength: int, max_item_strength: int):
        stats = StatsLibrary.ITEM_SOURCE_DEFAULT
        body = ItemSourceBody(EventEmitter(), stats, position, angle, hp)
        return ItemSource(self._event_bus, EventEmitter(), id, ownership, body, item_type, fertility, accumulated, min_item_strength, max_item_strength)
