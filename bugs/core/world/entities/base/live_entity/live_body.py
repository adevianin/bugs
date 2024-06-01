from core.world.utils.point import Point
from core.world.utils.event_emiter import EventEmitter
from core.world.settings import STEP_TIME
from core.world.entities.base.live_entity.visual_sensor import VisualSensor
from core.world.entities.base.live_entity.temperature_sensor import TemperatureSensor
from core.world.entities.base.enemy_interface import iEnemy
from core.world.entities.base.live_entity.memory import Memory
from core.world.entities.base.entity_types import EntityTypes, EntityTypesPack
from core.world.entities.colony.base.relation_tester import RelationTester
from core.world.entities.base.entity import Entity
from core.world.entities.item.items.base.item import Item
from core.world.entities.base.body import Body
from .live_stats import LiveStats

import math
from typing import List, Callable

class LiveBody(Body):

    stats: LiveStats

    def __init__(self, events: EventEmitter, stats: LiveStats, memory: Memory, position: Point, angle: int, hp: int, visual_sensor: VisualSensor, temperature_sensor: TemperatureSensor):
        super().__init__(events, stats, position, angle, hp)
        self.memory = memory
        self._max_calories = 1000
        self._calories = self._max_calories
        # self._distance_per_calorie = 2
        self._can_eat_calories_per_step = 20
        self._user_speed = stats.distance_per_step / STEP_TIME
        self._visual_sensor = visual_sensor
        self._temperature_sensor = temperature_sensor

    @property
    def visual_sensor(self) -> VisualSensor:
        return self._visual_sensor

    @property
    def temperature_sensor(self) -> TemperatureSensor:
        return self._temperature_sensor

    @property
    def user_speed(self):
        return self._user_speed

    @property
    def is_no_calories(self):
        return self._calories <= 0
    
    def step_to(self, destination_point: Point) -> bool:
        self._look_at(destination_point)

        new_position, passed_dist, is_walk_done = Point.do_step_on_path(self.position, destination_point, self.stats.distance_per_step)

        if (passed_dist == 0):
            return True

        # investing_calories = round(passed_dist / self._distance_per_calorie)
        # self._consume_calories(investing_calories)
        self.position = new_position

        self.events.emit('walk', new_position)
        
        return is_walk_done
    
    def step_to_near(self, point: Point, distance: int = 10):
        x = point.x + distance if self.position.x > point.x else point.x - distance
        y = point.y + distance if self.position.y > point.y else point.y - distance
        near_point = Point(x, y)

        return self.step_to(near_point)
    
    def check_am_i_hungry(self):
        return self._calories / (self._max_calories / 100) < 30
    
    def check_am_i_freezing(self) -> bool:
        return self._temperature_sensor.temperature < self.stats.min_temperature and not self.am_i_in_hibernation()
    
    def check_urge_to_hibernate(self) -> bool:
        return self._temperature_sensor.temperature + 1 <= self.stats.min_temperature and not self._temperature_sensor.is_warming

    def check_urge_to_exit_hibernation(self) -> bool:
        return self._temperature_sensor.temperature >= self.stats.min_temperature and self._temperature_sensor.is_warming
    
    def enter_hibernation(self):
        self.memory.save('am_in_hibernation', True)

    def exit_hibernation(self):
        self.memory.save('am_in_hibernation', False)

    def am_i_in_hibernation(self) -> bool:
        return bool(self.memory.read('am_in_hibernation'))
    
    def calc_how_much_calories_is_need(self):
        return self._max_calories - self._calories
    
    def eat_calories(self, count: int) -> bool:
        self._calories += count
        return self._calories >= self._max_calories
    
    def eat_edible_item(self, food: Item) -> bool:
        if (food.is_died):
            return True
        
        calories_i_need = self.calc_how_much_calories_is_need()
        calories_to_eat = min([calories_i_need, self._can_eat_calories_per_step, food.strength])

        self._calories += food.use(calories_to_eat)

        return food.is_died or self.calc_how_much_calories_is_need() == 0
    
    def damage_enemy(self, enemy_body: Body):
        enemy_body.receive_damage(20)

    def damage_nest(self, nest_body: Body):
        nest_body.receive_damage(10)
    
    def is_near_to_attack(self, point: Point):
        dist = self.position.dist(point)
        return dist <= self.stats.distance_per_step / 2

    def calc_nearest_point(self, points: List[Point]):
        nearest_dist = None
        nearest_point = None
        for point in points:
            dist = self.position.dist(point)
            if nearest_dist == None or dist < nearest_dist:
                nearest_dist = dist
                nearest_point = point

        return nearest_point
    
    def look_around(self, types_list: List[EntityTypes] = None, filter: Callable = None):
        return self._visual_sensor.get_nearby_entities(types_list, filter)
    
    def set_relation_tester(self, relation_tester: RelationTester):
        self._relation_tester = relation_tester

    def look_around_for_enemies(self) -> List[iEnemy]:
        enemies_filter: Callable[[Entity], bool] = lambda entity: not entity.is_died and self._relation_tester.is_enemy(entity)
        return self._visual_sensor.get_nearby_entities(EntityTypesPack.LIVE_ENTITIES, enemies_filter)
    
    def receive_colony_signal(self, signal: dict):
        self.events.emit(f'colony_signal:{ signal["type"] }', signal)

    def _look_at(self, point: Point):
        self.angle = (math.atan2(point.y - self.position.y, point.x - self.position.x) * 180 / math.pi) + 90

    def _consume_calories(self, amount: int):
        pass
        # self._calories -= amount
        # if self._calories < 0:
        #     self.hp = 0
    


