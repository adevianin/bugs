from core.world.entities.food.food import Food
from core.world.utils.point import Point
from core.world.utils.event_emiter import EventEmitter

class FoodFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_food(self, id: int, position: Point, calories: int):
        return Food(self._event_bus, id, position, calories) 

