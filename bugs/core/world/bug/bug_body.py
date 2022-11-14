from ..entity import Entity
from ..size import Size

class BugBody(Entity):
    def __init__(self, id, pos):
        super().__init__(id, pos, Size(10, 10))
        self._distance_per_energy = 1

    def replenish_step_energy(self):
        self._step_energy = 100

    def get_step_energy(self):
        return self._step_energy

    def consume_step_energy(self, value):
        self._step_energy -= value

    def get_distance_per_energy(self):
        return self._distance_per_energy
