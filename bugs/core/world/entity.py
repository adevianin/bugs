from .point import Point

class Entity:

    def __init__(self, main_event_bus, type, id, pos, size):
        self.id = id
        self._main_event_bus = main_event_bus
        self._pos = pos
        self._size = size
        self._type = type

    def update(self):
        pass

    def set_position(self, x, y):
        self._pos = Point(x, y)

    def get_position(self):
        return self._pos

    def to_json(self):
        pos = self.get_position()
        return {
            'id': self.id,
            'type': self._type,
            'pos': {
                'x': pos.x,
                'y': pos.y,
            },
            'size': {
                'width': self._size.width,
                'height': self._size.height
            }
        }

    def do_step(self):
        pass

    def do_action(self):
        pass

    def emit_change(self):
        self._main_event_bus.emit('entity_changed', self)

    
