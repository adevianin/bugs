from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.entities.item.item_sources.honeydew_item_source.honeydew_item_source import HoneydewItemSource
from core.world.entities.item.item_sources.honeydew_item_source.honeydew_item_source_body import HoneydewItemSourceBody
from core.world.entities.base.stats_library import StatsLibrary
from core.world.entities.base.ownership_config import OwnershipConfig

class ItemSourceFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_item_source(self, id: int, ownership: OwnershipConfig, is_removal_blocked: bool, hp: int, position: Point, angle: int, item_type: ItemTypes, 
                          fertility: int, accumulated: int, min_item_strength: int, max_item_strength: int):
        match(item_type):
            case ItemTypes.HONEYDEW:
                return self._build_honeydew_item_source(id, ownership, is_removal_blocked, hp, position, angle, fertility, accumulated, min_item_strength, max_item_strength)
            case _:
                raise Exception('unknown type of item source')

    def _build_honeydew_item_source(self, id: int, ownership: OwnershipConfig, is_removal_blocked: bool, hp: int, position: Point, angle: int, fertility: int, 
                                    accumulated: int, min_item_strength: int, max_item_strength: int):
        stats = StatsLibrary.ITEM_SOURCE_DEFAULT
        body = HoneydewItemSourceBody(EventEmitter(), stats, position, angle, hp)
        return HoneydewItemSource(self._event_bus, EventEmitter(), id, ownership, is_removal_blocked, body, fertility, accumulated, min_item_strength, max_item_strength)