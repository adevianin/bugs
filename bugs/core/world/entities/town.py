from .base.plain_entity import PlainEntity
from .base.entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.entities.food.food import Food

class Town(PlainEntity):

    def __init__(self, event_bus: EventEmitter, id: int, position: Point, color: str):
        super().__init__(event_bus, id, EntityTypes.TOWN, position)
        self._color = color
        self._area = 300
        self._stored_calories = 1000

    @property
    def color(self):
        return self._color

    @property
    def area(self):
        return self._area

    def do_step(self):
        pass

    def take_food(self, food: Food):
        self._stored_calories += food.calories
        food.die()

    def give_calories(self, count: int) -> int:
        if (self._stored_calories >= count):
            self._stored_calories -= count
            return count
        else:
            can_give = self._stored_calories
            self._stored_calories = 0
            return can_give

    def to_json(self):
        json = super().to_json()
        json.update({
            'color': self._color
        })
        
        return json