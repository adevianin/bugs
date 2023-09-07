from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.utils.size import Size
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.entities.item.item_areas.base.item_area import ItemArea
from core.world.entities.base.body import Body

class ItemAreaFactory():

    def build_item_area(self, id: int, from_colony_id: int, hp: int, position: Point, angle: int, size: Size, item_type: ItemTypes, fertility: int, accumulated: int):
        events = EventEmitter()
        body = Body(events, position, angle, hp)
        return ItemArea(events, id, from_colony_id, body, size, item_type, fertility, accumulated)