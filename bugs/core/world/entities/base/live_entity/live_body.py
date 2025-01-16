from core.world.utils.point import Point
from core.world.utils.event_emiter import EventEmitter
from core.world.settings import COLD_DAMAGE, HUNGER_THRESHOLD_PERCENTAGE, CALORIES_RESERVE_STEPS
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
from core.world.entities.base.damage_types import DamageTypes
from core.world.entities.base.death_record.age_death_record import AgeDeathRecord
from core.world.entities.base.death_record.hunger_death_record import HungerDeathRecord

import math
from typing import List, Callable

class LiveBody(Body):

    class MemoryKeys():
        AM_I_IN_HIBERNATION = 'am_in_hibernation'

    stats: LiveStats
    HIBERNATION_THRESHOLD = 1

    def __init__(self, events: EventEmitter, stats: LiveStats, memory: Memory, position: Point, angle: int, hp: int, birth_step: int, calories: int, visual_sensor: VisualSensor, 
                 temperature_sensor: TemperatureSensor):
        super().__init__(events, stats, position, angle, hp)
        self._birth_step = birth_step
        self.memory = memory
        self._max_calories = 1 if self.stats.appetite == 0 else self.stats.appetite * CALORIES_RESERVE_STEPS
        self._calories = calories
        # self._can_eat_calories_per_step = 20
        self._visual_sensor = visual_sensor
        self._temperature_sensor = temperature_sensor
        self._formation_distance_per_step = None

    @property
    def calories(self):
        return self._calories

    @property
    def birth_step(self):
        return self._birth_step

    @property
    def visual_sensor(self) -> VisualSensor:
        return self._visual_sensor

    @property
    def temperature_sensor(self) -> TemperatureSensor:
        return self._temperature_sensor

    @property
    def is_no_calories(self):
        return self._calories <= 0
    
    @property
    def is_in_fight(self):
        return bool(self.memory.read('is_in_fight'))
    
    @is_in_fight.setter
    def is_in_fight(self, value: bool):
        self.memory.save('is_in_fight', bool(value))

    @property
    def formation_distance_per_step(self):
        return self._formation_distance_per_step
    
    @formation_distance_per_step.setter
    def formation_distance_per_step(self, val: int):
        self._formation_distance_per_step = val

    def born(self):
        self._calories = self._max_calories
        self._hp = self.stats.max_hp
    
    def step_to(self, destination_point: Point) -> bool:
        if self._has_stun_effect:
            return
        
        if self.position.is_equal(destination_point):
            return True
        
        self._look_at(destination_point)

        dist_per_step = self.formation_distance_per_step or self.stats.distance_per_step
        new_position, is_walk_done = Point.do_step_on_line(self.position, destination_point, dist_per_step)

        self.position = new_position

        self.events.emit('step', new_position, dist_per_step)
        
        return is_walk_done
    
    def step_to_near(self, point: Point, distance: int = 10):
        x = point.x + distance if self.position.x > point.x else point.x - distance
        y = point.y + distance if self.position.y > point.y else point.y - distance
        near_point = Point(x, y)

        return self.step_to(near_point)
    
    def check_am_i_hungry(self):
        if self.stats.appetite == 0:
            return False
        else:
            return self._calories / (self._max_calories / 100) < HUNGER_THRESHOLD_PERCENTAGE
    
    def check_urge_to_hibernate(self) -> bool:
        return not self.am_i_in_hibernation() and (self._temperature_sensor.temperature <= self.stats.min_temperature + self.HIBERNATION_THRESHOLD)

    def check_urge_to_exit_hibernation(self) -> bool:
        return self.am_i_in_hibernation() and (self._temperature_sensor.temperature > self.stats.min_temperature + self.HIBERNATION_THRESHOLD) and self._temperature_sensor.is_warming
    
    def enter_hibernation(self):
        self.memory.save_flag(self.MemoryKeys.AM_I_IN_HIBERNATION, True)
        self.events.emit('enter_hibernation')

    def exit_hibernation(self):
        self.memory.save_flag(self.MemoryKeys.AM_I_IN_HIBERNATION, False)
        self.events.emit('exit_hibernation')

    def am_i_in_hibernation(self) -> bool:
        return self.memory.read_flag(self.MemoryKeys.AM_I_IN_HIBERNATION)
    
    def calc_how_much_calories_is_need(self):
        return self._max_calories - self._calories
    
    def eat_calories(self, count: int) -> bool:
        self._calories += count
        return self._calories >= self._max_calories
    
    def damage_another_body(self, body: Body):
        body.receive_damage(self.stats.attack, DamageTypes.COMBAT)
        self.events.emit('damaged_another_body')

    def receive_damage(self, damage: int, damage_type: DamageTypes):
        super().receive_damage(damage, damage_type)
        self.events.emit('received_damage', damage_type)
        if damage_type == DamageTypes.COMBAT:
            self._stun_effect()

    def calc_nearest_point(self, points: List[Point]):
        nearest_dist = None
        nearest_point = None
        for point in points:
            dist = self.position.dist(point)
            if nearest_dist == None or dist < nearest_dist:
                nearest_dist = dist
                nearest_point = point

        return nearest_point
    
    def sort_by_distance(self, entities: List[Entity]):
        entities = entities.copy()
        key: Callable[[Entity], int] = lambda entity: self.position.dist(entity.position)
        entities.sort(key=key)
        return entities
    
    def look_around(self, types_list: List[EntityTypes] = None, filter: Callable = None, nearest_first = False):
        entities = self._visual_sensor.get_nearby_entities(types_list, filter)
        if nearest_first:
            key: Callable[[Entity], int] = lambda entity: self.position.dist(entity.position)
            entities.sort(key = key)

        return entities
    
    def set_relation_tester(self, relation_tester: RelationTester):
        self._relation_tester = relation_tester

    def look_around_for_enemies(self, nearest_first: bool = True) -> List[iEnemy]:
        enemies_filter: Callable[[Entity], bool] = lambda entity: not entity.is_died and self._relation_tester.is_enemy(entity)
        return self.look_around(EntityTypesPack.LIVE_ENTITIES, enemies_filter, nearest_first)
    
    def receive_colony_signal(self, signal: dict):
        self.events.emit(f'colony_signal:{ signal["type"] }', signal)

    def handle_regeneration(self):
        if self.hp < self.stats.max_hp:
            self.hp += self.stats.hp_regen_rate

    def handle_aging(self, current_step: int):
        lived_steps = current_step - self.birth_step
        if lived_steps >= self.stats.life_span:
            self.die(AgeDeathRecord(self.position))

    def handle_temperature(self):
        if self.check_am_i_freezing():
            self.receive_damage(COLD_DAMAGE, DamageTypes.COLD)

    def handle_calories(self):
        self._calories -= self.stats.appetite
        if self._calories <= 0:
            self.die(HungerDeathRecord(self.position))

    def handle_exit_hibernation(self):
        if self.check_urge_to_exit_hibernation():
            self.exit_hibernation()

    def say(self, phrase: str, data: dict):
        pass

    def move_to_best_position(self, enemy_pos: Point):
        if self._has_stun_effect:
            return
        dist_to_enemy = self.position.dist(enemy_pos)
        dist_to_circle = dist_to_enemy / 2 if dist_to_enemy < self.stats.distance_per_step else self.stats.distance_per_step / 2
        circle_pos, is_walk_done = Point.do_step_on_line(self.position, enemy_pos, dist_to_circle)
        circle_radius = dist_to_circle
        live_entities_nearby = self.visual_sensor.get_nearby_entities(EntityTypesPack.LIVE_ENTITIES)
        generated_points = []
        for i in range(3):
            point = Point.generate_random_point_within_circle(circle_pos, circle_radius)
            generated_points.append(point)

        choosed_point = None
        entities_near_choosed_point = None
        for generated_point in generated_points:
            entities_counter = 0
            for entity in live_entities_nearby:
                if entity.position.dist(generated_point) < 10:
                    entities_counter += 1

            if entities_near_choosed_point is None or entities_counter < entities_near_choosed_point:
                entities_near_choosed_point = entities_counter
                choosed_point = generated_point

        self.step_to(choosed_point)

    def _look_at(self, point: Point):
        self.angle = (math.atan2(point.y - self.position.y, point.x - self.position.x) * 180 / math.pi) + 90

    def _stun_effect(self):
        self.memory.save('stun_effect', True, 1)

    @property
    def _has_stun_effect(self):
        return bool(self.memory.read('stun_effect'))
    
    def check_am_i_freezing(self) -> bool:
        return self._temperature_sensor.temperature < self.stats.min_temperature
    
    
    


