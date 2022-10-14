class Entity:

    def __init__(self, id, pos):
        self.id = id
        self.pos = {
            "x": pos['x'],
            "y": pos['y']
        }
