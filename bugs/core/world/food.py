from .entity import Entity
from .size import Size

class Food(Entity):

    def __init__(self, id, pos, calories):
        super().__init__(id, pos, Size(10, 10))
        self._calories = calories

    