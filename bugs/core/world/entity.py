class Entity:

    def __init__(self, id, pos):
        self.id = id
        self.pos = {
            "x": pos['x'],
            "y": pos['y']
        }

    def toJSON(self):
        return {
            'id': self.id,
            'pos': {
                'x': self.pos['x'],
                'y': self.pos['y']
            }
        }
