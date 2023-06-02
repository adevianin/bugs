from ..base.plain_entity import PlainEntity
from ..base.entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from .food_types import FoodTypes

class Food(PlainEntity):

    def __init__(self, event_bus: EventEmitter, id: int, position: Point, calories: int, food_type: FoodTypes, food_variety: int):
        super().__init__(event_bus, id, EntityTypes.FOOD, None, position)
        self._calories = calories
        self._food_type = food_type
        self._food_variety = food_variety

    def do_step(self):
        return super().do_step()

    @property
    def calories(self):
        return self._calories
    
    def pickup(self):
        self.toggle_hidden(True)
        self.handle_action('food_was_picked_up')

    @calories.setter
    def calories(self, value):
        if (value < 0):
            raise Exception('invalid calories value')
        self._calories = int(value)
        if (self._calories == 0):
            self.die()

    def to_json(self):
        json = super().to_json()
        json.update({
            'calories': self._calories,
            'food_type': self._food_type,
            'food_variety': self._food_variety
        })
        
        return json