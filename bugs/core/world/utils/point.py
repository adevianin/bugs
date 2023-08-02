from collections import namedtuple
from typing import List
import math

class Point(namedtuple('Point', ['x', 'y'])):

    @classmethod
    def from_json(cls, point_json:  List[int]):
        return Point(point_json[0], point_json[1])
    
    def dist(self, another_point: 'Point'):
        return math.dist([self.x, self.y], [another_point.x, another_point.y])