from core.world.utils.point import Point
from abc import ABC
from core.world.entities.food.food import Food
from core.world.utils.event_emiter import EventEmitter
from core.world.settings import TIME_POINTS_PER_TURN

import math

class Body(ABC):

    def __init__(self, events: EventEmitter, position: Point, distance_per_time_point: int, sight_distance: int):
        self.events = events
        self._time_points = 0
        self._distance_per_time_point = distance_per_time_point
        self._can_eat_calories_per_time_point = 2
        self._sight_distance = sight_distance
        self._position = position

        self.restore_time_points()
        self._validate_walking_stats()

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
    def time_points(self):
        return self._time_points

    def has_enough_time_points(self):
        return self._time_points > 0

    def step_to(self, destination_point: Point) -> bool:
        distance = math.dist([self.position.x, self.position.y], [destination_point.x, destination_point.y])
        if (distance == 0):
            return True
        x_distance = destination_point.x - self.position.x 
        y_distance = destination_point.y - self.position.y
        needed_time_points = distance / self._distance_per_time_point
        investing_time_points = round(needed_time_points if self._time_points >= needed_time_points else self._time_points)
        distance_can_walk = investing_time_points * self._distance_per_time_point
        percent_can_walk = (distance_can_walk * 100) / distance

        x_shift = x_distance * percent_can_walk / 100
        y_shift = y_distance * percent_can_walk / 100

        new_pos_x = round(self.position.x + x_shift)
        new_pos_y = round(self.position.y + y_shift)

        new_distance = math.dist([new_pos_x, new_pos_y], [destination_point.x, destination_point.y])
        
        self._cosume_time_points(investing_time_points)

        is_walk_done = new_distance < 1
        if (is_walk_done): 
            new_position = Point(destination_point.x, destination_point.y)
        else:
            new_position = Point(new_pos_x, new_pos_y)

        self.position = new_position

        self.events.emit('walk', position=new_position, consumed_time_points=investing_time_points)

        return is_walk_done

    def step_to_near(self, point: Point, distance: int = 10):
        x = point.x + distance if self.position.x > point.x else point.x - distance
        y = point.y + distance if self.position.y > point.y else point.y - distance
        near_point = Point(x, y)

        return self.step_to(near_point)

    def eat(self, food: Food):
        can_eat_calories = self._time_points * self._can_eat_calories_per_time_point
        if (food.calories >= can_eat_calories):
            food.calories -= can_eat_calories
            self._cosumer_all_time_points()
            return False
        else:
            needed_time_points = food.calories / self._can_eat_calories_per_time_point
            self._cosume_time_points(needed_time_points)
            food.calories = 0
            return True

    def restore_time_points(self):
        self._time_points = TIME_POINTS_PER_TURN

    def calc_distance_can_walk(self):
        return self._time_points * self._distance_per_time_point

    def _cosume_time_points(self, tp_count):
        self._time_points -= tp_count

    def _cosumer_all_time_points(self):
        self._time_points = 0

    def _validate_walking_stats(self):
        # if stats are incorrect then searching may be with errors
        max_can_walk = self._distance_per_time_point * TIME_POINTS_PER_TURN
        if (max_can_walk > self._sight_distance):
            raise Exception('walking stats incorect') 
