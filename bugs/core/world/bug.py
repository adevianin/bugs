from .entity import Entity
from threading import Thread
import math
import time

class Bug(Entity):
    def __init__(self, events, main_event_bus, id, pos):
        super().__init__(events, main_event_bus, id, pos)
        self._destination = None
        self._walk_speed = 10
        self._whole_time_to_walk = None
        self._walk_start_at = None

    def walk_path(self, points):
        walk_thread = Thread(target=self._execute_walk_path, args=points)
        walk_thread.start()
        return walk_thread

    def walk_to(self, x, y):
        walk_thread = Thread(target=self._execute_walking, args=(x,y))
        walk_thread.start()
        return walk_thread

    def set_destination(self, x, y):
        self._destination = {
            'x': x,
            'y': y
        }

    def get_position(self):
        if self.is_walking():
            time_in_walk = time.time() - self._walk_start_at
            walked_percent = ( 100 * time_in_walk ) / self._whole_time_to_walk
            current_x = self._calc_coord_for_walked_percent(self._pos['x'], self._destination['x'], walked_percent)
            current_y = self._calc_coord_for_walked_percent(self._pos['y'], self._destination['y'], walked_percent)

            return {
                'x': current_x,
                'y': current_y
            }
        else:
            return super().get_position()

    def to_json(self):
        json = super().to_json()
        json.update({
            'walk_speed': self._walk_speed,
            'destination': self._destination
        })
        return json

    def is_walking(self):
        return self._destination != None

    def _execute_walking(self, x, y):
        if self.is_walking(): 
            return

        self.set_destination(x, y)
        distance = math.dist([self._pos['x'], self._pos['y']], [x, y])
        self._whole_time_to_walk = distance / self._walk_speed
        self._walk_start_at = time.time()
        self.emit_change()

        time.sleep(self._whole_time_to_walk)

        self.set_position({
            'x': self._destination['x'],
            'y': self._destination['y']
        })
        self._clear_walknig()

        self.events.emit('arrived')
        self.emit_change()

    def _execute_walk_path(self, *points):
        for point in points:
            self._execute_walking(point['x'], point['y'])

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
