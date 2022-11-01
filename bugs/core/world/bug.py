from .entity import Entity
import math
import time
from .point import Point

class Bug(Entity):
    def __init__(self, events, main_event_bus, id, pos):
        super().__init__(events, main_event_bus, id, pos)
        self._walk_speed = 10
        self._clear_walknig()

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

    def update(self):
        if self.is_walking():
            self._update_walking_position()

    def _update_walking_position(self):
        time_in_walk = time.time() - self._walk_start_at
        is_walking_done = time_in_walk >= self._whole_time_to_walk
        if is_walking_done:
            self.set_position(self._destination.x, self._destination.y)
            self._clear_walknig()

            self.events.emit('arrived')
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
