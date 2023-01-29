from core.world.utils.point import Point
from abc import ABC

import math

class Body(ABC):

    def __init__(self, position: Point, max_energy: int, distance_per_energy: int, sight_distance: int):
        self._distance_per_energy = distance_per_energy
        self._sight_distance = sight_distance
        self._energy = 0
        self._max_energy = max_energy
        self._position = position

        self.restore_energy()

    @property
    def position(self):
        return self._position

    @position.setter
    def position(self, value):
        self._position = value

    @property
    def energy(self):
        return self._energy

    def step_to(self, destination_point: Point) -> bool:
        distance = math.dist([self.position.x, self.position.y], [destination_point.x, destination_point.y])
        x_distance = destination_point.x - self.position.x 
        y_distance = destination_point.y - self.position.y
        needed_energy = distance / self._distance_per_energy
        investing_energy = needed_energy if self.energy >= needed_energy else self.energy
        investing_energy = math.ceil(investing_energy)
        self._consume_energy(investing_energy)
        distance_can_walk = investing_energy * self._distance_per_energy
        percent_can_walk = (distance_can_walk * 100) / distance

        x_shift = x_distance * percent_can_walk / 100
        y_shift = y_distance * percent_can_walk / 100

        new_pos_x = int(self.position.x + x_shift)
        new_pos_y = int(self.position.y + y_shift)

        new_distance = math.dist([new_pos_x, new_pos_y], [destination_point.x, destination_point.y])

        if int(new_distance) == 0:
            self.position = Point(destination_point.x, destination_point.y)
            return True
        else:
            self.position = Point(new_pos_x, new_pos_y)
            return False

    def restore_energy(self):
        self._energy = self._max_energy

    def reset_energy(self):
        self._energy = 0

    def _consume_energy(self, consumed_value: int):
        if self._energy < consumed_value:
            raise Exception('not enough energy to consume')
        self._energy -= int(consumed_value)

    

    

