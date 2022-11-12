from .point import Point
from sympy import Polygon, Point2D

class Entity:

    def __init__(self, id, pos, size):
        self.id = id
        self._pos = pos
        self._size = size
        self._build_geometry()

    def update(self):
        pass

    def set_position(self, x, y):
        self._pos = Point(x, y)
        self._build_geometry()

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
                'width': self._size.width,
                'height': self._size.height
            }
        }

    def get_geometry(self):
        return self._geomertry

    def calc_distance_to(self, other_entity):
        other_geometry = other_entity.get_geometry()
        return float(self._geomertry.distance(other_geometry))

    def do_step(self):
        pass

    def do_action(self):
        pass

    def _build_geometry(self):
        half_height = self._size.height / 2
        half_width = self._size.width / 2
        p1 = Point2D(self._pos.x - half_width, self._pos.y - half_height)
        p2 = Point2D(self._pos.x + half_width, self._pos.y - half_height)
        p3 = Point2D(self._pos.x + half_width, self._pos.y + half_height)
        p4 = Point2D(self._pos.x - half_width, self._pos.y + half_height)
        
        self._geomertry = Polygon(p1, p2, p3, p4)

    
