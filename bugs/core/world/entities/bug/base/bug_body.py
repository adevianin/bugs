from core.world.entities.base.live_entity.body import Body
from core.world.utils.point import Point
from core.world.entities.food.food import Food
from core.world.utils.event_emiter import EventEmitter

class BugBody(Body):

    def __init__(self, events: EventEmitter, position: Point):
        super().__init__(events, position, 32, 100)
        self._picked_food = None

    @property
    def is_food_picked(self):
        return self._picked_food is not None
    
    @property
    def picked_food(self):
        return self._picked_food

    def pick_up_food(self, food: Food):
        self._picked_food = food
        food.toggle_hidden(True)
        self.events.emit('food_picked', food_id=food.id)
        return True

    def give_food(self):
        res = self._picked_food
        self._picked_food = None
        self.events.emit('picked_food_gave')
        return res
        