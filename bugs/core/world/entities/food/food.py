from ..base.plain_entity import PlainEntity
from ..base.entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from .food_types import FoodTypes

class Food(PlainEntity):

    def __init__(self, event_bus: EventEmitter, id: int, position: Point, hp: int, calories: int, food_type: FoodTypes, food_variety: int, is_picked: bool):
        super().__init__(event_bus, id, EntityTypes.FOOD, None, hp, position)
        self._calories = calories
        self._food_type = food_type
        self._food_variety = food_variety
        self._is_picked = is_picked

    def do_step(self):
        return super().do_step()

    @property
    def calories(self):
        return self._calories
    
    @property
    def food_type(self):
        return self._food_type
    
    @property
    def food_variety(self):
        return self._food_variety
    
    @property
    def is_picked(self):
        return self._is_picked
    
    def pickup(self):
        self._is_picked = True
        self.handle_action('food_was_picked_up')

    @calories.setter
    def calories(self, value):
        if (value < 0):
            raise Exception('invalid calories value')
        self._calories = int(value)
        if (self._calories == 0):
            self.die()

    def to_public_json(self):
        json = super().to_public_json()
        json.update({
            'calories': self._calories,
            'food_type': self._food_type,
            'food_variety': self._food_variety,
            'is_picked': self._is_picked
        })
        
        return json