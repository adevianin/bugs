from core.world.entities.base.live_entity.body import Body
from core.world.utils.point import Point
from core.world.entities.food.food import Food
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.nest.nest import Nest
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.base.live_entity.world_interactor import WorldInteractor
from core.world.entities.base.live_entity.memory import Memory
from core.world.entities.colony.formation.formation import Formation

class AntBody(Body):

    def __init__(self, events: EventEmitter, sayer: EventEmitter, memory: Memory, dna_profile: str, position: Point, hp: int, located_in_nest: Nest, picked_food: Food, world_interactor: WorldInteractor):
        super().__init__(events, sayer, memory, dna_profile, position, 32, 200, located_in_nest, hp, world_interactor)
        self._picked_food = picked_food
        self._formation = None

    @property
    def is_food_picked(self):
        return self._picked_food is not None
    
    @property
    def picked_food(self):
        return self._picked_food
    
    @property
    def picked_food_id(self):
        return self._picked_food.id if self.is_food_picked else None
    
    @property
    def has_formation(self):
        return self._formation != None
    
    @property
    def formation(self):
        return self._formation
    
    def set_formation(self, formation: Formation):
        self._formation = formation
        unit_number = self._formation.register_unit(self.position)
        self.memory.save('formation_unit_number', unit_number)
        self._formation.events.add_listener('reached_destination', self.remove_formation)

    def remove_formation(self):
        if self.has_formation:
            self._formation.events.remove_listener('reached_destination', self.remove_formation)
            self.formation.remove_unit(self.memory.read('formation_unit_number'))
            self.memory.clear('formation_unit_number')
            self._formation = None

    def step_in_formation(self):
        unit_number = self.memory.read('formation_unit_number')
        position = self._formation.get_position_for_unit(unit_number)
        return self.step_to(position)
    
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

    def _on_position_changed(self):
        super()._on_position_changed()
        if self.has_formation:
            self._tell_position_to_formation()

    def _tell_position_to_formation(self):
        self._formation.unit_changed_position(self.position, self.memory.read('formation_unit_number'))