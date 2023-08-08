from core.world.entities.food.food import Food
from core.world.utils.point import Point
from core.world.utils.size import Size
from core.world.utils.event_emiter import EventEmitter
from .food_types import FoodTypes
from .food_area import FoodArea
from .food_source import FoodSource
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
    
    def build_food_source(self, id: int, hp: int, position: Point, fertility: int, food_type: FoodTypes, calories: int):
        events = EventEmitter()
        return FoodSource(events=events, id=id, hp=hp, position=position, fertility=fertility, food_type=food_type, calories=calories)
    
    def _generate_variety(self, food_type: FoodTypes):
        match food_type:
            case FoodTypes.LEAF:
                return random.randint(1, 4)
            case FoodTypes.NECTAR:
                return random.randint(1, 3)
            case FoodTypes.HONEYDEW:
                return 1
            case _:
                raise Exception('unknown type of food')

