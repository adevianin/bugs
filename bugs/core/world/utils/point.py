from collections import namedtuple
from typing import List

class Point(namedtuple('Point', ['x', 'y'])):
    @classmethod
    def from_json(cls, point_json:  List[int]):
        return Point(point_json[0], point_json[1])