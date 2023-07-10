from core.world.entities.food.food import Food
from core.world.utils.point import Point
from core.world.utils.size import Size
from core.world.utils.event_emiter import EventEmitter
from .food_types import FoodTypes
from .preborn_food import PrebornFood
from .food_area import FoodArea
import random

class FoodFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_food(self, id: int, position: Point, calories: int, type: FoodTypes, food_variety: int):
        if (food_variety == -1):
            food_variety = self._generate_variety(type)
        return Food(self._event_bus, id, position, calories, type, food_variety) 
    
    def build_food_area(self, id: int, position: Point, size: Size, fertility: int, food_type: FoodTypes):
        return FoodArea(self._event_bus, id, position, size, fertility, food_type)
    
    def _generate_variety(self, food_type: FoodTypes):
        match food_type:
            case FoodTypes.LEAF:
                return random.randint(1, 4)
            case FoodTypes.NECTAR:
                return random.randint(1, 3)
            case _:
                raise Exception('unknown type of food')

