from core.world.entities.base.live_entity.body import Body
from core.world.utils.point import Point
from core.world.entities.food.food import Food
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.nest.nest import Nest
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.base.live_entity.world_interactor import WorldInteractor

class AntBody(Body):

    _world_interactor: WorldInteractor

    def __init__(self, events: EventEmitter, dna_profile: str, position: Point, hp: int, located_in_nest: Nest, picked_food: Food, world_interactor: WorldInteractor):
        super().__init__(events, dna_profile, position, 32, 200, located_in_nest, hp, world_interactor)
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
    
    def look_around_for_food(self):
        return self._world_interactor.get_nearby_entities([EntityTypes.FOOD])
    
    def build_nest(self, nest: Nest):
        nest.build()
        self._consume_calories(10)
    
    def pick_up_food(self, food: Food):
        self._picked_food = food
        food.pickup()
        self.events.emit('food_picked', food_id=food.id)
        return True

    def give_food(self, nest: Nest):
        nest.take_food(self._picked_food)
        self._picked_food = None
        self.events.emit('picked_food_gave')

    def drop_picked_food(self):
        self._picked_food.drop(Point(self.position.x, self.position.y))
        self._picked_food = None
        self.events.emit('picked_food_dropped')

    def found_nest(self, position: Point, colony_id: int, callback):
        self.events.emit('birth_request', {
            'entity_type': EntityTypes.NEST,
            'position': position,
            'colony_id': colony_id,
            'callback': callback
        })

    def damage_nest(self, nest: Nest):
        nest.damage(10)
        