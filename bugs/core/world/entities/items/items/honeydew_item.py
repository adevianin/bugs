from core.world.entities.items.base.item_types import ItemTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.entities.items.base.edible_item import EdibleItem

class HoneydewItem(EdibleItem):
    
    def __init__(self, events: EventEmitter, id: int, position: Point, is_picked: bool, item_variety: int, calories: int):
        super().__init__(events, id, ItemTypes.HONEYDEW, position, is_picked, item_variety, calories)