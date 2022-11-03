from .point import Point

class Entity:

    def __init__(self, id, pos, size):
        self.id = id
        self._pos = pos
        self._size = size

    def update(self):
        pass

    def set_position(self, x, y):
        self._pos = Point(x, y)

    def get_position(self):
        return self._pos

    def to_json(self):
        return {
            'id': self.id,
            'pos': {
                'x': self._pos.x,
                'y': self._pos.y,
            },
            'size': {
                'width': self._size.width,
                'height': self._size.height
            }
        }

    
