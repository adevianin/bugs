from .point import Point

class Entity:

    def __init__(self, events, main_event_bus, id, pos):
        self.main_event_bus = main_event_bus
        self.id = id
        self._pos = pos
        self.size = {
            'width': 10,
            'height': 10
        }
        self.events = events

    def set_position(self, x, y):
        self._pos = Point(x, y)

    def get_position(self):
        return self._pos

    def to_json(self):
        pos = self.get_position()
        return {
            'id': self.id,
            'pos': {
                'x': pos.x,
                'y': pos.y,
            },
            'size': {
                'width': self.size['width'],
                'height': self.size['height']
            }
        }

    def emit_change(self):
        self.main_event_bus.emit('entity_changed', self)
