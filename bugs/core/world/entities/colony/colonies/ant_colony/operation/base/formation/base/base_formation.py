from typing import List
from core.world.entities.ant.base.ant import Ant
from core.world.utils.point import Point
from core.world.utils.event_emiter import EventEmitter
from abc import ABC, abstractmethod
from core.world.entities.base.enemy_interface import iEnemy
from .formation_types import FormationTypes

class BaseFormation(ABC):

    FORMATION_ARRIVAL_THRESHOLD = 10
    MIN_FORMATION_DIST = 100

    @staticmethod
    def check_is_formation_needed(units: List[Ant], destination_point: Point):
        centroid = Point.cacl_centroid([unit.position for unit in units])
        return centroid.dist(destination_point) > BaseFormation.MIN_FORMATION_DIST

    def __init__(self, events: EventEmitter, type: FormationTypes, name: str, units: List[Ant], current_position: Point, destination_point: Point):
        self.events = events
        self._units = units
        self._destination_point = destination_point
        self._unit_step_size = self._get_unit_step_size(units)
        self._unit_size = self._get_unit_size(units)
        self._is_walk_done = False
        self._targeted_enemy: iEnemy = None
        self._type = type
        self._name = name

        current_position = current_position if current_position else self._generate_formation_position()
        self._set_current_position(current_position)
        self._setup_formation_distance_per_step()

    @property
    def name(self):
        return self._name

    @property
    def type(self):
        return self._type
    
    @property
    def units_ids(self):
        return list(unit.id for unit in self._units)
    
    @property
    def current_position(self) -> Point:
        return self._current_position
    
    @property
    def destination_point(self) -> Point:
        return self._destination_point
    
    def start(self):
        self._order_units_to_free_mind()
        self._order_units_move_on_positions()
    
    def step_pulse(self):
        if self._should_optimize_formation_position():
            pos = self._generate_formation_position()
            self._set_current_position(pos)
            self._regroup_walking_units()

        if self._check_are_all_units_on_positions():
            if self._check_is_formation_reached_destionation():
                self._done()
            else:
                self._do_next_step()
    
    def destroy(self):
        self._order_units_to_free_mind()
        self.events.remove_all_listeners()
        self._clear_formation_distance_per_step()

    def remove_ant(self, ant: Ant):
        if not ant.is_died:
            ant.formation_distance_per_step = None
        self._units.remove(ant)
        self._regroup_walking_units()
        if len(self._units) == 0:
            self.events.emit('no_units')

    def _regroup_walking_units(self):
        self._order_units_to_free_mind()
        self._order_units_move_on_positions()

    def _do_next_step(self):
        new_pos, is_walk_done = Point.do_step_on_line(self._current_position, self._destination_point, self._unit_step_size)
        self._set_current_position(new_pos)
        self._order_units_move_on_positions()

    @abstractmethod
    def _calc_unit_place_position(self, unit_place_number: int) -> Point:
        pass

    def _check_are_all_units_on_positions(self):
        for unit_place_number, unit in enumerate(self._units):
            formation_unit_position = self._calc_unit_place_position(unit_place_number)
            if not formation_unit_position.is_equal(unit.position):
                return False
            
        return True
    
    def _update_angle(self):
        self._angle = Point.calculate_angle_to_x_axis(self._current_position, self._destination_point)

    def _set_current_position(self, position: Point):
        self._current_position = position
        if not self._destination_point.is_equal(self._current_position): #to not update angle to 0
            self._update_angle()

    def _check_is_formation_reached_destionation(self):
        return self._current_position.dist(self._destination_point) < self.FORMATION_ARRIVAL_THRESHOLD
    
    def _done(self):
        self.events.emit('done')
        # self.destroy()

    def _get_unit_step_size(self, units: List[Ant]):
        step_sizes = (unit.body.stats.distance_per_step for unit in units)
        step_size = min(step_sizes)
        return step_size
    
    def _get_unit_size(self, units: List[Ant]):
        return units[0].body.SIZE
    
    def _generate_formation_position(self) -> Point:
        return Point.cacl_centroid([unit.position for unit in self._units])
    
    def _search_enemy(self) -> iEnemy:
        enemies = []
        for unit in self._units:
            enemies += unit.look_around_for_enemies()

        if len(enemies) > 0:
            return enemies[0]
        else:
            return None

    def _order_units_move_on_positions(self):
        for unit_place_number, unit in enumerate(self._units):
            formation_unit_position = self._calc_unit_place_position(unit_place_number)
            if not formation_unit_position.is_equal(unit.position):
                unit.walk_to(formation_unit_position)
                
    def _order_units_to_attack_targeted_enemy(self):
        for unit in self._units:
            unit.fight_enemy(self._targeted_enemy)

    def _order_units_to_free_mind(self):
        for unit in self._units:
            unit.free_mind()

    def _should_optimize_formation_position(self):
        far_away_units_count = 0
        for unit_place_number, unit in enumerate(self._units):
            formation_unit_position = self._calc_unit_place_position(unit_place_number)
            dist = unit.position.dist(formation_unit_position)
            if dist > self._unit_step_size * 3:
                far_away_units_count += 1
        
        return far_away_units_count > len(self._units) / 2
    
    def _setup_formation_distance_per_step(self):
        min_dist_per_step = self._units[0].stats.distance_per_step
        for unit in self._units:
            if unit.stats.distance_per_step < min_dist_per_step:
                min_dist_per_step = unit.stats.distance_per_step

        for unit in self._units:
            unit.formation_distance_per_step = min_dist_per_step

    def _clear_formation_distance_per_step(self):
        for unit in self._units:
            unit.formation_distance_per_step = None
    