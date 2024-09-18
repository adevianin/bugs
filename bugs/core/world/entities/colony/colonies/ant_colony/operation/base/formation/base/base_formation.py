from typing import List
from core.world.entities.ant.base.ant import Ant
from core.world.utils.point import Point
from core.world.utils.event_emiter import EventEmitter
from abc import ABC, abstractmethod
from core.world.entities.base.enemy_interface import iEnemy
from .formation_types import FormationTypes
from enum import StrEnum

class FormationState(StrEnum):
        INITIAL = 'initial'
        WALKING = 'walking'

class BaseFormation(ABC):

    def __init__(self, events: EventEmitter, type: FormationTypes, name: str, state: FormationState, units: List[Ant], current_position: Point, destination_point: Point):
        self.events = events
        self._units = units
        self._destination_point = destination_point
        self._unit_step_size = self._get_unit_step_size(units)
        self._unit_size = self._get_unit_size(units)
        self._is_walk_done = False
        self._is_destroyed = False
        self._targeted_enemy: iEnemy = None
        self._type = type
        self._state = state if state else FormationState.INITIAL
        self._name = name

        current_position = current_position if current_position else self._generate_formation_position()
        self._set_current_position(current_position)

    @property
    def name(self):
        return self._name

    @property
    def is_destroyed(self):
        return self._is_destroyed
    
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
    
    @property
    def state(self) -> FormationState:
        return self._state
    
    def step_pulse(self):
        is_someone_died = self._handle_died_units()

        if self._state == FormationState.INITIAL:
            self._start_walking()
        elif self._state == FormationState.WALKING:
            if is_someone_died:
                self._regroup_walking_units()

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
        if self.is_destroyed:
            return

        self._is_destroyed = True
        self.events.emit('destroyed')
        self.events.remove_all_listeners()

    def _regroup_walking_units(self):
        self._order_units_to_free_mind()
        self._order_units_move_on_positions()

    def _start_walking(self):
        self._order_units_to_free_mind()
        if self._state != FormationState.WALKING:
            self._state = FormationState.WALKING
            self.events.emit('before_walking')
        self._order_units_move_on_positions()

    def _do_next_step(self):
        new_pos, passed_dist, is_walk_done = Point.do_step_on_path(self._current_position, self._destination_point, self._unit_step_size)
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
        self._update_angle()

    def _check_is_formation_reached_destionation(self):
        return self._current_position.is_equal(self._destination_point)
    
    def _done(self):
        self.events.emit('done')
        self.destroy()

    def _get_unit_step_size(self, units: List[Ant]):
        step_sizes = (unit.body.stats.distance_per_step for unit in units)
        step_size = min(step_sizes)
        return step_size
    
    def _get_unit_size(self, units: List[Ant]):
        return units[0].body.SIZE
    
    def _generate_formation_position(self) -> Point:
        x_list = []
        y_list = []
        for unit in self._units:
            x_list.append(unit.position.x)
            y_list.append(unit.position.y)

        x = sum(x_list) / len(self._units)
        y = sum(y_list) / len(self._units)

        return Point(x, y)
    
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

    def _handle_died_units(self):
        died_units = []
        for unit in self._units:
            if unit.is_died:
                died_units.append(unit)
        
        for died_unit in died_units:
            self._units.remove(died_unit)

        if len(self._units) == 0:
            self.destroy()

        is_someone_died = len(died_units) > 0
        return is_someone_died

    def _should_optimize_formation_position(self):
        far_away_units_count = 0
        for unit_place_number, unit in enumerate(self._units):
            formation_unit_position = self._calc_unit_place_position(unit_place_number)
            dist = unit.position.dist(formation_unit_position)
            if dist > self._unit_step_size * 3:
                far_away_units_count += 1
        
        return far_away_units_count > len(self._units) / 2
    