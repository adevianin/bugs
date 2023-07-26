from core.world.utils.point import Point
from abc import ABC
from core.world.entities.food.food import Food
from core.world.utils.event_emiter import EventEmitter
from core.world.settings import STEP_TIME
from core.world.entities.nest.nest import Nest
from core.world.entities.base.live_entity.world_interactor import WorldInteractor
from core.world.entities.base.enemy_interface import iEnemy

import math

class Body(ABC):

    def __init__(self, events: EventEmitter, dna_profile: str, position: Point, distance_per_step: int, sight_distance: int, located_in_nest: Nest, hp: int, world_interactor: WorldInteractor):
        self.events = events
        self._dna_profile = dna_profile
        self._distance_per_step = distance_per_step
        self._sight_distance = sight_distance
        self._position = position
        self._max_calories = 1000
        self._calories = self._max_calories
        self._distance_per_calorie = 2
        self._can_eat_calories_per_step = 20
        self._user_speed = self._distance_per_step / STEP_TIME
        self._located_inside_nest = located_in_nest
        self._hp = hp
        self._world_interactor = world_interactor

    @property
    def world_interactor(self):
        return self._world_interactor

    @property
    def located_in_nest_id(self):
        return self._located_inside_nest.id if self._located_inside_nest else None
    
    @property
    def is_in_nest(self):
        return self._located_inside_nest != None
    
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
    
    @property
    def is_no_calories(self):
        return self._calories <= 0
    
    @property
    def dna_profile(self):
        return self._dna_profile
    
    @property
    def hp(self):
        return self._hp

    @hp.setter
    def hp(self, hp: int):
        self._hp = hp
        if self._hp <= 0:
            self.events.emit('zero_hp')

    def say(self, phrase: str, data: dict):
        event_name = f'say:{phrase}'
        if (data):
            self.events.emit(event_name, data)
        else:
            self.events.emit(event_name)

    def get_in_nest(self, nest: Nest):
        self._located_inside_nest = nest
        self.events.emit('got_in_nest', nest)

    def get_out_of_nest(self):
        self._located_inside_nest = None
        self.events.emit('got_out_of_nest')

    def step_to(self, destination_point: Point, preciseMode = False) -> bool:
        if self.is_in_nest:
            self.get_out_of_nest()
            return False
        
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

        is_walk_done = self._are_points_near(Point(new_pos_x, new_pos_y), Point(destination_point.x, destination_point.y), preciseMode)

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
        if (food.is_died):
            return True
        
        calories_i_need = self.calc_how_much_calories_is_need()
        calories_to_eat = min([calories_i_need, self._can_eat_calories_per_step, food.calories])

        food.calories -= calories_to_eat
        self._calories += calories_to_eat

        is_food_eaten = food.calories == 0

        self.events.emit('eat_food')

        return is_food_eaten or self.calc_how_much_calories_is_need() == 0
    
    def damage_enemy(self, enemy: iEnemy):
        enemy.damage(20)
    
    def is_near_to(self, point: Point, is_precise_mode: bool = False):
        return self._are_points_near(self.position, point, is_precise_mode)
    
    def _are_points_near(self, point1: Point, point2: Point, is_precise_mode: bool = False):
        dist = math.dist([point1.x, point1.y], [point2.x, point2.y])
        return dist < 1 if is_precise_mode else dist <= self._distance_per_step / 2
    
    def _consume_calories(self, amount: int):
        self._calories -= amount
        if self._calories < 0:
            self.hp = 0
