from ..entity import Entity
from ..size import Size
import math

class BugBody(Entity):
    def __init__(self, id, pos):
        super().__init__(id, pos, Size(10, 10))
        self._distance_per_energy = 1
        self._sight_distance = 50

    def replenish_step_energy(self):
        self._step_energy = 100

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
