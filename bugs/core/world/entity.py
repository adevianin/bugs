class Entity:

    def __init__(self, main_event_bus, id, pos):
        self.main_event_bus = main_event_bus
        self.id = id
        self.pos = {
            'x': pos['x'],
            'y': pos['y']
        }
        self.size = {
            'width': 10,
            'height': 10
        }

    def set_position(self, pos):
        self.pos['x'] = pos['x']
        self.pos['y'] = pos['y']
        self.main_event_bus.emit('entity_changed', self)

    def toJSON(self):
        return {
            'id': self.id,
            'pos': {
                'x': self.pos['x'],
                'y': self.pos['y']
            },
            'size': {
                'width': self.size['width'],
                'height': self.size['height']
            }
        }
