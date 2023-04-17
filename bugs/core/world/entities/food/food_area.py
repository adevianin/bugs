from core.world.entities.base.plain_entity import PlainEntity
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.utils.size import Size
from core.world.entities.base.entity_types import EntityTypes
from .food_factory import FoodFactory
from .food_types import FoodTypes
import random

class FoodArea(PlainEntity):

    def __init__(self, event_bus: EventEmitter, id: int, position: Point, size: Size, food_factory: FoodFactory, fertility: int, food_type: FoodTypes):
        super().__init__(event_bus, id, EntityTypes.FOOD_AREA, position)
        self._size = size
        self._food_factory = food_factory
        self._fertility = fertility
        self._calories = 0
        self._food_type = food_type

    def do_step(self):
        self._calories += self._fertility
        if (self._calories > 100): 
            spawn_food = random.choice([True, False, False, False])
            if (spawn_food):
                spawn_point = self._generate_spawn_point()
                food = self._food_factory.build_food(-1, spawn_point, self._calories, self._food_type, -1)
                self._calories = 0
                self._event_bus.emit('entity_born', food)

    def _generate_spawn_point(self):
        half_width = self._size.width / 2
        half_height = self._size.height / 2
        minX = self.position.x - half_width if self.position.x - half_width > 0 else 0
        maxX = self.position.x + half_width
        x = random.randint(minX, maxX)
        minY = self.position.y - half_height if self.position.y - half_height > 0 else 0
        maxY = self.position.y + half_height
        y = random.randint(minY, maxY)

        return Point(x, y)
