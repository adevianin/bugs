from core.world.utils.point import Point
from abc import ABC
from core.world.entities.food.food import Food
from core.world.utils.event_emiter import EventEmitter
from core.world.settings import STEP_TIME

import math

class Body(ABC):

    def __init__(self, events: EventEmitter, position: Point, distance_per_step: int, sight_distance: int):
        self.events = events
        self._distance_per_step = distance_per_step
        self._sight_distance = sight_distance
        self._position = position
        self._max_calories = 1000
        self._calories = self._max_calories
        self._distance_per_calorie = 2
        self._can_eat_calories_per_step = 20
        self._user_speed = self._distance_per_step / STEP_TIME
        self._is_busy = False

    @property
    def user_speed(self):
        return self._user_speed

    @property
    def position(self):
        return self._position
    
    @property
    def distance_per_step(self):
        return self._distance_per_step

    @position.setter
    def position(self, value):
        self._position = value
        self.events.emit('position_changed')

    @property
    def sight_distance(self):
        return self._sight_distance

    def step_to(self, destination_point: Point, preciseMode = False) -> bool:
        distance = math.dist([self.position.x, self.position.y], [destination_point.x, destination_point.y])
        if (distance == 0):
            return True
        x_distance = destination_point.x - self.position.x 
        y_distance = destination_point.y - self.position.y

        walking_distance = min([self._distance_per_step, distance]) if preciseMode else self._distance_per_step
        percent_can_walk = (walking_distance * 100) / distance
        investing_calories = round(walking_distance / self._distance_per_calorie)

        x_shift = x_distance * percent_can_walk / 100
        y_shift = y_distance * percent_can_walk / 100

        new_pos_x = self.position.x + x_shift
        new_pos_y = self.position.y + y_shift

        self._consume_calories(investing_calories)

        new_distance = math.dist([new_pos_x, new_pos_y], [destination_point.x, destination_point.y])
        is_walk_done = new_distance < 1 if preciseMode else new_distance <= self._distance_per_step / 2

        if preciseMode and is_walk_done:
            new_position = Point(destination_point.x, destination_point.y)
        else:
            new_position = Point(new_pos_x, new_pos_y)

        self.position = new_position

        self.events.emit('walk', position=new_position)

        return is_walk_done

    def step_to_near(self, point: Point, distance: int = 10, preciseMode = False):
        x = point.x + distance if self.position.x > point.x else point.x - distance
        y = point.y + distance if self.position.y > point.y else point.y - distance
        near_point = Point(x, y)

        return self.step_to(near_point, preciseMode)
    
    def check_am_i_hungry(self):
        return self._calories / (self._max_calories / 100) < 30
    
    def calc_how_much_calories_is_need(self):
        return self._max_calories - self._calories
    
    def eat_calories(self, count: int) -> bool:
        self._calories += count
        return self._calories >= self._max_calories
    
    def eat_food(self, food: Food) -> bool:
        calories_i_need = self.calc_how_much_calories_is_need()
        calories_to_eat = min([calories_i_need, self._can_eat_calories_per_step, food.calories])

        food.calories -= calories_to_eat
        self._calories += calories_to_eat

        is_food_eaten = food.calories == 0

        self.events.emit('eat_food', food_id=food.id, is_food_eaten=is_food_eaten)

        return is_food_eaten or self.calc_how_much_calories_is_need() == 0
    
    def toggle_is_busy(self, is_busy: bool):
        self._is_busy = is_busy
    
    @property
    def is_busy(self):
        return self._is_busy
        
    def _consume_calories(self, amount: int):
        self._calories -= amount
