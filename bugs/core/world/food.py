from .entity import Entity
from .size import Size
from .entity_types import EntityTypes

class Food(Entity):

    def __init__(self, main_event_bus, id, pos, calories):
        super().__init__(main_event_bus, EntityTypes.FOOD, id, pos, Size(10, 10))
        self._calories = calories

    