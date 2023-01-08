from .entity import Entity
from .entity_types import EntityTypes
from .point import Point
import random

class FoodArea(Entity):

    FOOD_PER_STEP = 0.1
    MAX_FOOD_COUNT = 5

    def __init__(self, main_event_bus, id, pos, size, world_factory):
        super().__init__(main_event_bus, EntityTypes.FOOD_AREA, id, pos, size)
        self._world_factory = world_factory
        self._acumulated_food = 0
        self._foods = []

    def get_foods(self):
        return self._foods

    def do_step(self):
        if len(self._foods) >= self.MAX_FOOD_COUNT:
            return
        self._acumulated_food += self.FOOD_PER_STEP
        growed_food_count = int(self._acumulated_food)
        if growed_food_count > 0:
            self._acumulated_food -= growed_food_count
            for _ in range(growed_food_count):
                food = self._generate_food()
                self._foods.append(food)
            self.emit_change()

    def _generate_food(self):
        pos = self._generate_postion_for_food()
        calories = random.randint(30, 200)
        food = self._world_factory.build_food(None, pos, calories)
        return food

    def _generate_postion_for_food(self):
        half_width = int(self._size.width / 2)
        half_height = int(self._size.height / 2)
        pos_x = random.randint(self._pos.x - half_width, self._pos.x + half_width)
        pos_y = random.randint(self._pos.y - half_height, self._pos.y + half_height)
        return Point(pos_x, pos_y)

    def to_json(self):
        foods_json = []
        for food in self._foods:
            foods_json.append(food.to_json())

        json = super().to_json()
        json.update({
            'foods': foods_json
        })

        return json