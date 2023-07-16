from core.world.utils.event_emiter import EventEmitter
from core.world.entities.world.world import World
from core.world.entities.food.food_factory import FoodFactory
from core.world.entities.food.preborn_food import PrebornFood
from core.world.entities.map.map import Map

class FoodBirther():

    def __init__(self, event_bus: EventEmitter, food_factory: FoodFactory):
        self._event_bus = event_bus
        self._food_factory = food_factory

        self._event_bus.add_listener('food_birth_request', self._on_food_birth_request)

    def set_map(self, map: Map):
        self._map = map

    def _on_food_birth_request(self, preborn_food: PrebornFood):
        new_food = self._food_factory.build_food(None, preborn_food.position, preborn_food.calories, preborn_food.food_type, -1, False)
        self._map.add_new_entity(new_food)
        new_food.born()
