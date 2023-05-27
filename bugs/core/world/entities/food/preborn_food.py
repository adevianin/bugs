from core.world.utils.point import Point
from core.world.entities.base.preborn_entity import PrebornEntity
from .food_types import FoodTypes

class PrebornFood(PrebornEntity):

    @classmethod
    def build_preborn_food(cls, position: Point, calories: int, food_type: FoodTypes):
        return PrebornFood(position, calories, food_type)

    def __init__(self, position: Point, calories: int, food_type: FoodTypes) -> None:
        super().__init__(position)
        self._calories = calories
        self._food_type = food_type

    @property
    def calories(self):
        return self._calories
    
    @property
    def food_type(self):
        return self._food_type