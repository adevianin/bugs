from core.world.entities.food.food import Food
from core.world.utils.point import Point
from core.world.utils.event_emiter import EventEmitter
from core.world.id_generator import IdGenerator

class FoodFactory():

    def __init__(self, event_bus: EventEmitter, id_generator: IdGenerator):
        self._event_bus = event_bus
        self._id_generator = id_generator

    def build_food(self, id: int, position: Point, calories: int):
        if (id == -1):
            id = self._id_generator.generate_id()
        return Food(self._event_bus, id, position, calories) 

