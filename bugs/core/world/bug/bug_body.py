from ..entity import Entity
from ..size import Size
from ..entity_types import EntityTypes

class BugBody(Entity):

    REPLENISH_ENERGY_AMOUNT_PER_STEP = 100

    def __init__(self, main_event_bus, id, pos):
        super().__init__(main_event_bus, EntityTypes.BUG, id, pos, Size(10, 10))
        self._distance_per_energy = 1
        self._sight_distance = 150
        self._eating_per_energy = 0.5
        self.replenish_step_energy()

    def replenish_step_energy(self):
        self._step_energy = BugBody.REPLENISH_ENERGY_AMOUNT_PER_STEP

    def get_step_energy(self):
        return self._step_energy

    def consume_step_energy(self, value):
        self._step_energy -= int(value)

    def get_distance_per_energy(self):
        return self._distance_per_energy

    def get_sight_distance(self):
        return self._sight_distance

    def get_distance_can_walk(self):
        return self._step_energy * self._distance_per_energy

    def get_max_distance_can_walk_per_step(self):
        return self._distance_per_energy * BugBody.REPLENISH_ENERGY_AMOUNT_PER_STEP

    def eat(self, food_entity):
        eaten_calories = food_entity.eat(self.get_calories_can_eat())
        self.consume_step_energy(eaten_calories / self._eating_per_energy)

    def wait_next_turn(self):
        self._step_energy = 0

    def get_eating_per_energy(self):
        return self._eating_per_energy

    def get_calories_can_eat(self):
        return self._step_energy * self._eating_per_energy
