from core.world.entities.base.plain_entity import PlainEntity
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.utils.size import Size
from core.world.entities.base.entity_types import EntityTypes
from .food_types import FoodTypes
from .preborn_food import PrebornFood
import random

class FoodArea(PlainEntity):

    def __init__(self, event_bus: EventEmitter, id: int, position: Point, size: Size, fertility: int, food_type: FoodTypes):
        super().__init__(event_bus, id, EntityTypes.FOOD_AREA, None, position)
        self._size = size
        self._fertility = fertility
        self._calories = 0
        self._food_type = food_type

    @property
    def size(self):
        return self._size
    
    @property
    def fertility(self):
        return self._fertility

    @property
    def food_type(self):
        return self._food_type

    def do_step(self):
        self._calories += self._fertility
        if (self._calories > 100): 
            spawn_food = random.choice([True, False, False, False])
            if (spawn_food):
                spawn_point = self._generate_spawn_point()
                preborn_food = PrebornFood.build_preborn_food(spawn_point, self._calories, self._food_type)
                self._calories = 0
                self._event_bus.emit('preborn_food', preborn_food)

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
