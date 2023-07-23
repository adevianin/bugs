from core.world.utils.point import Point
from core.world.utils.size import Size
from core.world.entities.food.food_types import FoodTypes
from core.world.entities.food.food_factory import FoodFactory

class JsonFoodFactory():

    def __init__(self, food_factory: FoodFactory):
        self._food_factory = food_factory

    def build_food_from_json(self, food_json):
        position = Point(food_json['position'][0], food_json['position'][1])
        food_type = FoodTypes(food_json['food_type'])
        return self._food_factory.build_food(food_json['id'], position, food_json['hp'], food_json['calories'], food_type, food_json['food_variety'], food_json['is_picked'])
    
    def build_food_area_from_json(self, area_json):
        position = Point(area_json['position'][0], area_json['position'][1])
        size = Size(area_json['size'][0], area_json['size'][1])
        food_type = FoodTypes(area_json['food_type'])
        return self._food_factory.build_food_area(area_json['id'], position, area_json['hp'], size, area_json['fertility'], food_type)