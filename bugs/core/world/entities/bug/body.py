from core.world.entities.base.live_entity.body import Body
from core.world.utils.point import Point
from core.world.entities.food.food import Food
from core.world.utils.event_emiter import EventEmitter
from core.world.settings import MIN_TIME_POINTS_ACTION_COST

class BugBody(Body):

    def __init__(self, events: EventEmitter, position: Point):
        super().__init__(events, position, 0.5, 150)
        self._picked_food = None

    @property
    def is_food_picked(self):
        return self._picked_food is not None

    def pick_up_food(self, food: Food):
        if (self._time_points >= MIN_TIME_POINTS_ACTION_COST):
            self._picked_food = food
            food.toggle_hidden(True)
            self._cosume_time_points(MIN_TIME_POINTS_ACTION_COST)
            self.events.emit('food_picked', consumed_time_points=MIN_TIME_POINTS_ACTION_COST, food_id=food.id)
            return True
        else:
            return False

    def give_food(self):
        res = self._picked_food
        self._picked_food = None
        self.events.emit('picked_food_gave', consumed_time_points=MIN_TIME_POINTS_ACTION_COST)
        return res
        