from .entity import Entity
import math
import time
from .point import Point
from .bug_activities import BugActivitie
import random
from .size import Size
import sympy

class Bug(Entity):
    def __init__(self, events, main_event_bus, id, pos):
        super().__init__(id, pos, Size(10, 10))
        self._events = events
        self._main_event_bus = main_event_bus
        self._walk_speed = 20
        self._clear_walknig()
        self._sight = 100
        self.set_activity(BugActivitie.WANDERING)

    def walk_to(self, x, y):
        if self.is_walking(): 
            return

        self.set_destination(x, y)
        distance = self._calc_distance_to_destination()
        self._whole_time_to_walk = distance / self._walk_speed
        self._walk_start_at = time.time()
        self._walk_start_pos = Point(self._pos.x, self._pos.y)

        self.emit_change()

    def set_destination(self, x, y):
        self._destination = Point(x, y)

    def to_json(self):
        json = super().to_json()
        json.update({
            'walk_speed': self._walk_speed,
            'destination': None if not self.is_walking() else {
                'x': self._destination.x,
                'y': self._destination.y,
            }
        })

        return json

    def is_walking(self):
        return self._destination != None

    def update(self, bugs_in_sight, blocks_in_sight):
        if self.is_walking():
            self._update_walking_position()

        match self._activity:
            case BugActivitie.WANDERING:
                if not self.is_walking():
                    point = self._generate_next_wandering_point(blocks_in_sight)
                    self.walk_to(point.x, point.y)
            case BugActivitie.IDLE:
                print('idle')


    def set_activity(self, activity):
        self._activity = activity

    def emit_change(self):
        self._main_event_bus.emit('entity_changed', self)

    def get_sight(self):
        return self._sight

    def _generate_next_wandering_point(self, blocks_in_sight):
        x = self._pos.x + random.randint(-60, 60)
        y = self._pos.y + random.randint(-60, 60)

        walking_line = sympy.Segment(sympy.Point(self._pos.x, self._pos.y), sympy.Point(x, y))

        walking_line_intersections = []
        for block in blocks_in_sight:
            walking_line_intersections += block.get_geometry().intersection(walking_line)

        min_distance = None
        nearest_point = None
        if len(walking_line_intersections) != 0:
            for point in walking_line_intersections:
                distance = point.distance(sympy.Point(self._pos.x, self._pos.y))
                if min_distance == None or distance < min_distance:
                    min_distance = distance
                    nearest_point = point
            x = float(nearest_point.x)
            y = float(nearest_point.y)
            padding = 1
            x = x + padding if self._pos.x > x else x - padding
            y = y + padding if self._pos.y > y else y - padding

        return Point(x, y)

    def _update_walking_position(self):
        time_in_walk = time.time() - self._walk_start_at
        is_walking_done = time_in_walk >= self._whole_time_to_walk
        if is_walking_done:
            self.set_position(self._destination.x, self._destination.y)
            self._clear_walknig()

            self._events.emit('arrived')
            self.emit_change()
        else:
            walked_percent = ( 100 * time_in_walk ) / self._whole_time_to_walk
            current_x = self._calc_coord_for_walked_percent(self._walk_start_pos.x, self._destination.x, walked_percent)
            current_y = self._calc_coord_for_walked_percent(self._walk_start_pos.y, self._destination.y, walked_percent)

            self.set_position(current_x, current_y)

    def _calc_coord_for_walked_percent(self, start_coord, end_coord, walked_percent):
        distance = abs(abs(end_coord) - abs(start_coord))
        distance_passed = distance * (walked_percent  / 100)
        if end_coord > start_coord:
            return start_coord + distance_passed
        else:
            return start_coord - distance_passed

    def _clear_walknig(self):
        self._destination = None
        self._whole_time_to_walk = None
        self._walk_start_at = None
        self._walk_start_pos = None

    def _calc_distance_to_destination(self):
        return math.dist([self._pos.x, self._pos.y], [self._destination.x, self._destination.y])
