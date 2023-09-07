from abc import ABC, abstractmethod
from core.world.utils.point import Point
from core.world.utils.event_emiter import EventEmitter
from typing import Dict
from core.world.utils.size import Size

class Formation(ABC):

    def __init__(self, event_bus: EventEmitter, unit_size: Size, events: EventEmitter, dest_point: Point, unit_step_size: int, position: Point = None, should_optimize_position_closer: bool = True):
        self.events = events
        self._unit_size = unit_size
        self._event_bus = event_bus
        self._position = position
        self._dest_point = dest_point
        self._unit_step_size = unit_step_size
        self._units: Dict[str, Dict] = {}
        self._is_formation_reach_destination = False
        self._should_optimize_position_closer = should_optimize_position_closer

        self._event_bus.add_listener('step_start', self._on_step_start)

    @property
    def _units_count(self):
        return len(self._units)
    
    @property
    def _units_in_formation(self):
        return ((unit_id, unit) for unit_id, unit in self._units.items() if not unit['is_removed'])
    
    def _get_moving_units(self):
        res = []
        for unit_id in self._units:
            unit = self._units[unit_id]
            if not unit['is_removed']:
                res.append(unit)
        return res

    @abstractmethod
    def _calc_unit_formation_position(self, unit_id):
        pass

    def register_unit(self, current_unit_position: Point, is_passive_unit: bool = False, special_unit_id: str = None):
        if self._position == None:
            self._change_position(current_unit_position)
            
        unit_id = special_unit_id or len(self._units)
        self._units[unit_id] = {
            'current_position': current_unit_position,
            'formation_position': self._calc_unit_formation_position(unit_id),
            'is_removed': False,
            'is_passive': is_passive_unit
        }

        return unit_id

    def get_position_for_unit(self, unit_id: int) -> Point:
        return self._units[unit_id]['formation_position']
    
    def unit_changed_position(self, position: Point, unit_id: int):
        unit = self._units[unit_id]
        unit['current_position'] = position

        if not unit['is_passive'] and self._check_is_unit_on_formation_position(unit):
            self._request_move_passive_units()

    def remove_unit(self, unit_id: int):
        unit = self._units[unit_id]
        unit['is_removed'] = True

    def destory(self):
        self.events.emit('destroyed')
        self._event_bus.remove_listener('step_start', self._on_step_start)
        self.events.remove_all_listeners()

    def _should_optimize_formation_position(self):
        if not self._should_optimize_position_closer:
            return False
        
        far_away_units_count = 0
        for unit_id in self._units:
            unit = self._units[unit_id]
            current_pos: Point = unit['current_position']
            formation_pos: Point = unit['formation_position']
            dist = current_pos.dist(formation_pos)
            if dist > self._unit_step_size * 3:
                far_away_units_count += 1
        
        return far_away_units_count > len(self._units) / 2
    
    def _request_move_passive_units(self):
        for unit_id, unit in self._units_in_formation:
            if unit['is_passive'] and not self._check_is_unit_on_formation_position(unit):
                self.events.emit(f'passive_unit_move_request:{unit_id}')

    def _change_position(self, new_pos: Point):
        self._position = new_pos
        self._x_axis_angle = self._calc_x_axis_angle()
        self._calc_unit_formation_positions()

    def _calc_unit_formation_positions(self):
        for unit_id in self._units:
            unit = self._units[unit_id]
            if not unit['is_removed']:
                unit['formation_position'] = self._calc_unit_formation_position(unit_id)

    def _check_are_all_units_on_positions(self):
        for unit_id, unit in self._units_in_formation:
            if not self._check_is_unit_on_formation_position(unit):
                return False
         
        return True
    
    # def _check_are_all_active_units_on_positions(self):
    #     for unit_id, unit in self._units_in_formation:
    #         if not unit['is_passive'] and not self._check_is_unit_on_formation_position(unit):
    #             return False
            
    #     return True
    
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
        for unit_id in self._units:
            unit = self._units[unit_id]
            unit['is_on_formation_position'] = False

    def _calc_x_axis_angle(self):
        return Point.calculate_angle_to_x_axis(self._position, self._dest_point)

    def _do_next_step(self):
        new_pos, passed_dist, is_walk_done = Point.do_step_on_path(self._position, self._dest_point, self._unit_step_size)
        self._change_position(new_pos)

    def _optimize_position(self):
        x_list = []
        y_list = []
        for unit_id in self._units:
            unit = self._units[unit_id]
            current_position: Point = unit['current_position']
            x_list.append(current_position.x)
            y_list.append(current_position.y)

        new_x = sum(x_list) / len(self._units)
        new_y = sum(y_list) / len(self._units)
        self._change_position(Point(new_x, new_y))
        
    def _on_step_start(self, step_number):
        if self._check_are_all_units_on_positions():
            self.events.emit('all_units_on_positions')
            if self._chek_is_formation_reached_destionation():
                self._done()
            else:
                self._do_next_step()

        if self._should_optimize_formation_position():
            self._optimize_position()



