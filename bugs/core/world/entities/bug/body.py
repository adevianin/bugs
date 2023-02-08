from core.world.entities.base.live_entity import Body
from core.world.utils.point import Point
from core.world.entities.food.food import Food
from core.world.utils.event_emiter import EventEmitter

class BugBody(Body):

    PICKUP_FOOD_ENERGY_COST = 2

    def __init__(self, events: EventEmitter, position: Point):
        super().__init__(events, position, 100, 0.5, 150)
        self._picked_food = None

    @property
    def is_food_picked(self):
        return self._picked_food is not None

    def pick_up_food(self, food: Food):
        if (self._energy >= BugBody.PICKUP_FOOD_ENERGY_COST):
            self._picked_food = food
            self._consume_energy(BugBody.PICKUP_FOOD_ENERGY_COST)
            self.events.emit('food_picked')
            food.mark_as_deleted()
            return True
        else:
            return False

    def give_food(self):
        res = self._picked_food
        self._picked_food = None
        return res
        