from core.world.entities.items.base.item_types import ItemTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from .item import Item

class EdibleItem(Item):

    def __init__(self, events: EventEmitter, id: int, item_type: ItemTypes, position: Point, is_picked: bool, item_variety: int, calories: int):
        super().__init__(events, id, item_type, position, is_picked, item_variety)
        self._calories = calories

    @property
    def calories(self):
        return self._calories

    @calories.setter
    def calories(self, value):
        if (value < 0):
            raise Exception('invalid calories value')
        self._calories = int(value)
        if (self._calories == 0):
            self.die()