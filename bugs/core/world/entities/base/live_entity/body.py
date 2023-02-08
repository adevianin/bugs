from core.world.utils.point import Point
from abc import ABC
from core.world.entities.food.food import Food
from core.world.utils.event_emiter import EventEmitter

import math

class Body(ABC):

    def __init__(self, events: EventEmitter, position: Point, max_energy: int, distance_per_energy: int, sight_distance: int):
        self.events = events
        self._distance_per_energy = distance_per_energy
        self._sight_distance = sight_distance
        self._energy = 0
        self._max_energy = max_energy
        self._position = position
        self._can_eat_calories_per_energy = 2

        self.restore_energy()

    @property
    def position(self):
        return self._position

    @position.setter
    def position(self, value):
        self._position = value
        self.events.emit('position_changed')

    @property
    def sight_distance(self):
        return self._sight_distance

    @property
    def energy(self):
        return self._energy

    def step_to(self, destination_point: Point) -> bool:
        distance = math.dist([self.position.x, self.position.y], [destination_point.x, destination_point.y])
        if (distance == 0):
            return True
        x_distance = destination_point.x - self.position.x 
        y_distance = destination_point.y - self.position.y
        needed_energy = distance / self._distance_per_energy
        investing_energy = round(needed_energy if self.energy >= needed_energy else self.energy)
        distance_can_walk = investing_energy * self._distance_per_energy
        percent_can_walk = (distance_can_walk * 100) / distance

        x_shift = x_distance * percent_can_walk / 100
        y_shift = y_distance * percent_can_walk / 100

        new_pos_x = round(self.position.x + x_shift)
        new_pos_y = round(self.position.y + y_shift)

        new_distance = math.dist([new_pos_x, new_pos_y], [destination_point.x, destination_point.y])
        
        self._consume_energy(investing_energy)

        if new_distance < 1: 
            self.position = Point(destination_point.x, destination_point.y)
            return True
        else:
            self.position = Point(new_pos_x, new_pos_y)
            return False

    def step_to_near(self, point: Point, distance: int = 10):
        x = point.x + distance if self.position.x > point.x else point.x - distance
        y = point.y + distance if self.position.y > point.y else point.y - distance
        near_point = Point(x, y)

        return self.step_to(near_point)

    def eat(self, food: Food):
        can_eat_calories = self._energy * self._can_eat_calories_per_energy
        if (food.calories >= can_eat_calories):
            food.calories -= can_eat_calories
            self._consume_whole_energy()
            return False
        else:
            needed_energy = food.calories / self._can_eat_calories_per_energy
            self._consume_energy(needed_energy)
            food.calories = 0
            return True

    def restore_energy(self):
        self._energy = self._max_energy

    def reset_energy(self):
        self._energy = 0

    def calc_distance_can_walk(self):
        return self._energy * self._distance_per_energy

    def wait_next_turn(self):
        self._consume_whole_energy()

    def _consume_whole_energy(self):
        self._consume_energy(self._energy)

    def _consume_energy(self, consumed_value: int):
        if self._energy < consumed_value:
            raise Exception('not enough energy to consume')
        self._energy = self._energy - consumed_value
