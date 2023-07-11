from core.world.entities.base.live_entity.body import Body
from core.world.utils.point import Point
from core.world.entities.food.food import Food
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.nest.nest import Nest

class AntBody(Body):

    def __init__(self, events: EventEmitter, dna_profile: str, position: Point, located_in_nest: Nest, picked_food: Food):
        super().__init__(events, dna_profile, position, 32, 100, located_in_nest)
        self._picked_food = picked_food

    @property
    def is_food_picked(self):
        return self._picked_food is not None
    
    @property
    def picked_food(self):
        return self._picked_food
    
    @property
    def picked_food_id(self):
        return self._picked_food.id if self.is_food_picked else None
    
    def pick_up_food(self, food: Food):
        self._picked_food = food
        food.pickup()
        self.events.emit('food_picked', food_id=food.id)
        return True

    def give_food(self, nest: Nest):
        nest.take_food(self._picked_food)
        self._picked_food = None
        self.events.emit('picked_food_gave')
        