class FoodGrower:

    def __init__(self, map, world_factory):
        self._map = map
        self._world_factory = world_factory
        self._food_per_step = 0.05
        self._acumulated_food = 0
        self._food_calories = 50

    def do_grow_step(self):
        self._acumulated_food += self._food_per_step
        growed_food_count = int(self._acumulated_food)
        if growed_food_count > 0:
            self._acumulated_food -= growed_food_count
            for _ in range(growed_food_count):
                random_pos = self._map.get_random_position()
                food = self._world_factory.build_food(None, random_pos, self._food_calories)
                self._map.add_food(food)
                food.emit_change()
