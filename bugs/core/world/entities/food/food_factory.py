from core.world.entities.food.food import Food
from core.world.utils.point import Point
from core.world.utils.size import Size
from core.world.utils.event_emiter import EventEmitter
from .food_types import FoodTypes
from .preborn_food import PrebornFood
from .food_area import FoodArea
from core.world.id_generator import IdGenerator
import random

class FoodFactory():

    def __init__(self, event_bus: EventEmitter, id_generator: IdGenerator):
        self._event_bus = event_bus
        self._id_generator = id_generator

    def build_food_from_json(self, food_json):
        position = Point(food_json['position'][0], food_json['position'][1])
        food_type = FoodTypes(food_json['food_type'])
        return self.build_food(food_json['id'], position, food_json['calories'], food_type, food_json['food_variety'])

    def build_food(self, id: int, position: Point, calories: int, type: FoodTypes, food_variety: int):
        if (food_variety == -1):
            food_variety = self._generate_variety(type)
        return Food(self._event_bus, id, position, calories, type, food_variety) 
    
    def give_birth(self, preborn_food: PrebornFood):
        return self.build_food(self._id_generator.generate_id(), preborn_food.position, preborn_food.calories, preborn_food.food_type, -1)
    
    def build_food_area_from_json(self, area_json):
        position = Point(area_json['position'][0], area_json['position'][1])
        size = Size(area_json['size'][0], area_json['size'][1])
        food_type = FoodTypes(area_json['food_type'])
        return self.build_food_area(area_json['id'], position, size, area_json['fertility'], food_type)
    
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

