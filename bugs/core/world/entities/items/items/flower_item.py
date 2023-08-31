from core.world.entities.items.base.item_types import ItemTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.entities.items.base.item import Item

class FlowerItem(Item):

    ITEM_VARIETIES_COUNT = 3

    def __init__(self, events: EventEmitter, id: int, position: Point, is_picked: bool, item_variety: int):
        super().__init__(events, id, ItemTypes.FLOWER, position, is_picked, item_variety)