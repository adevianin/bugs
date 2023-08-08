from core.world.entities.base.entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.entities.base.plain_entity import PlainEntity
from core.world.entities.food.food_types import FoodTypes
from core.world.entities.food.preborn_food import PrebornFood
from typing import Callable

import random

class FoodSource(PlainEntity):
    
    def __init__(self, events: EventEmitter, id: int, hp: int, position: Point, fertility: int, food_type: FoodTypes, calories: int):
        super().__init__(events, id, EntityTypes.FOOD_SOURCE, None, hp, position)
        self._fertility = fertility
        self._food_type = food_type
        self._calories = calories

    @property
    def fertility(self):
        return self._fertility

    @property
    def food_type(self):
        return self._food_type
    
    @property
    def calories(self):
        return self._calories
    
    def do_step(self):
        self._calories += self._fertility

    def take_some_food(self, on_food_ready: Callable):
        min_caloric_value = min(self._fertility * 2, self._calories)
        max_caloric_value = min(self._fertility * 6, self._calories)
        calories = random.randint(min_caloric_value, max_caloric_value)

        if calories == 0:
            return False

        self._calories -= calories

        self.events.emit('birth_request', {
            'entity_type': EntityTypes.FOOD,
            'preborn_food': PrebornFood.build_preborn_food(position=self._position, calories=calories, food_type=FoodTypes.HONEYDEW),
            'callback': on_food_ready
        })

        return True
    
    def to_public_json(self):
        json = super().to_public_json()
        json.update({
            'food_type': self._food_type
        })
        
        return json