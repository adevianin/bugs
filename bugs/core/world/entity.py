class Entity:

    def __init__(self, events, main_event_bus, id, pos):
        self.main_event_bus = main_event_bus
        self.id = id
        self._pos = {
            'x': pos['x'],
            'y': pos['y']
        }
        self.size = {
            'width': 10,
            'height': 10
        }
        # TODO use di
        self.events = events

    def set_position(self, pos):
        self._pos['x'] = pos['x']
        self._pos['y'] = pos['y']

    def get_position(self):
        return self._pos

    def to_json(self):
        return {
            'id': self.id,
            'pos': self.get_position(),
            'size': {
                'width': self.size['width'],
                'height': self.size['height']
            }
        }

    def emit_change(self):
        self.main_event_bus.emit('entity_changed', self)
