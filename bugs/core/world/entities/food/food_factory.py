from core.world.entities.food.food import Food
from core.world.utils.point import Point
from core.world.utils.size import Size
from core.world.utils.event_emiter import EventEmitter
from .food_types import FoodTypes
from .food_area import FoodArea
import random

class FoodFactory():

    def build_new_food(self, id: int, position: Point, calories: int, type: FoodTypes):
        return self.build_food(id, position, 100, calories, type, -1, False)

    def build_food(self, id: int, position: Point, hp: int, calories: int, type: FoodTypes, food_variety: int, is_picked: bool):
        if (food_variety == -1):
            food_variety = self._generate_variety(type)
        events = EventEmitter()
        return Food(events, id, position, hp, calories, type, food_variety, is_picked) 
    
    def build_food_area(self, id: int, position: Point, hp: int, size: Size, fertility: int, food_type: FoodTypes):
        events = EventEmitter()
        return FoodArea(events, id, position, hp, size, fertility, food_type)
    
    def _generate_variety(self, food_type: FoodTypes):
        match food_type:
            case FoodTypes.LEAF:
                return random.randint(1, 4)
            case FoodTypes.NECTAR:
                return random.randint(1, 3)
            case _:
                raise Exception('unknown type of food')

