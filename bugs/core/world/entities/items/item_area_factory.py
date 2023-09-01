from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.utils.size import Size
from core.world.entities.items.base.item_types import ItemTypes
from core.world.entities.items.base.item_area import ItemArea

class ItemAreaFactory():

    def build_item_area(self, id: int, from_colony_id: int, hp: int, position: Point, size: Size, item_type: ItemTypes, fertility: int, accumulated: int):
        events = EventEmitter()
        return ItemArea(events, id, from_colony_id, hp, position, size, item_type, fertility, accumulated)