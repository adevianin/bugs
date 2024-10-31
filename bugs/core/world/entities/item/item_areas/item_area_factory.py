from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.utils.size import Size
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.entities.item.item_areas.base.item_area import ItemArea
from core.world.entities.base.body import Body
from core.world.entities.base.stats_library import StatsLibrary
from core.world.entities.base.ownership_config import OwnershipConfig

class ItemAreaFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_item_area(self, id: int, ownership: OwnershipConfig, hp: int, position: Point, angle: int, size: Size, item_type: ItemTypes, fertility: int, accumulated: int):
        body = Body(EventEmitter(), StatsLibrary.GHOST_DEFAULT, position, angle, hp)
        return ItemArea(self._event_bus, EventEmitter(), id, ownership, body, size, item_type, fertility, accumulated)