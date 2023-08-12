from abc import ABC, abstractmethod
from core.world.utils.point import Point
from core.world.utils.event_emiter import EventEmitter
from typing import Dict

class Formation(ABC):
    UNIT_WIDTH = 32
    UNIT_HEIGHT = 32

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, dest_point: Point, unit_step_size: int):
        self.events = events
        self._event_bus = event_bus
        self._position = None
        self._dest_point = dest_point
        self._unit_step_size = unit_step_size
        self._units: Dict[int, Dict] = {}
        self._is_formation_reach_destination = False

        self._event_bus.add_listener('step_start', self._on_step_start)

    @property
    def _units_count(self):
        return len(self._units)

    @abstractmethod
    def _calc_unit_formation_position(self, unit_number):
        pass

    def register_unit(self, current_unit_position: Point):
        if self._position == None:
            self._change_position(current_unit_position)
            
        unit_number = len(self._units)
        self._units[unit_number] = {
            'current_position': current_unit_position,
            'formation_position': self._calc_unit_formation_position(unit_number),
            'is_removed': False
        }

        return unit_number

    def get_position_for_unit(self, unit_number: int):
        return self._units[unit_number]['formation_position']
    
    def unit_changed_position(self, position: Point, unit_number: int):
        self._units[unit_number]['current_position'] = position
        
    def remove_unit(self, unit_number: int):
        unit = self._units[unit_number]
        unit['is_removed'] = True

    def destory(self):
        self._event_bus.remove_listener('step_start', self._on_step_start)
        self.events.remove_all_listeners()

    def _should_move_formation_position(self):
        far_away_units_count = 0
        for unit_number in self._units:
            unit = self._units[unit_number]
            current_pos: Point = unit['current_position']
            formation_pos: Point = unit['formation_position']
            dist = current_pos.dist(formation_pos)
            if dist > self._unit_step_size * 3:
                far_away_units_count += 1
        
        return far_away_units_count > len(self._units) / 2

    def _change_position(self, new_pos: Point):
        self._position = new_pos
        self._x_axis_angle = self._calc_x_axis_angle()
        self._calc_unit_formation_positions()

    def _calc_unit_formation_positions(self):
        for unit_number in self._units:
            unit = self._units[unit_number]
            if not unit['is_removed']:
                unit['formation_position'] = self._calc_unit_formation_position(unit_number)

    def _check_are_all_units_on_positions(self):
        for unit_number in self._units:
            unit = self._units[unit_number]
            if not self._check_is_unit_on_formation_position(unit) and not unit['is_removed']:
                return False
            
        return True
    
    def _check_is_unit_on_formation_position(self, unit):
        formation_pos: Point = unit['formation_position']
        current_pos: Point = unit['current_position']
        return current_pos.is_equal(formation_pos)
    
    def _chek_is_formation_reached_destionation(self):
        return self._position.is_equal(self._dest_point)

    def _done(self):
        self.events.emit('reached_destination')
        self.destory()

    def _reset_units_on_position(self):
        for unit_number in self._units:
            unit = self._units[unit_number]
            unit['is_on_formation_position'] = False

    def _calc_x_axis_angle(self):
        return Point.calculate_angle_to_x_axis(self._position, self._dest_point)

    def _do_next_step(self):
        new_pos, passed_dist, is_walk_done = Point.do_step_on_path(self._position, self._dest_point, self._unit_step_size)
        self._change_position(new_pos)

    def _move_position_closer(self):
        x_list = []
        y_list = []
        for unit_number in self._units:
            unit = self._units[unit_number]
            current_position: Point = unit['current_position']
            x_list.append(current_position.x)
            y_list.append(current_position.y)

        new_x = sum(x_list) / len(self._units)
        new_y = sum(y_list) / len(self._units)
        self._change_position(Point(new_x, new_y))
        
    def _on_step_start(self, step_number):
        if self._check_are_all_units_on_positions():
            if self._chek_is_formation_reached_destionation():
                self._done()
            else:
                self._do_next_step()

        if self._should_move_formation_position():
            self._move_position_closer()



