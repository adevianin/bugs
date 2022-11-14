from sympy import Segment
from .point import Point
import math

class Map:

    def __init__(self, size):
        self._size = size
        self._blocks = []
        self._bugs = []

    def add_bug(self, bug):
        self._bugs.append(bug)

    def add_block(self, block):
        self._blocks.append(block)

    def get_bugs(self):
        return self._bugs

    def get_blocks(self):
        return self._blocks

    def get_size(self):
        return self._size

    def get_block_intersection(self, start_point, end_point):
        segment = Segment([start_point.x, start_point.y], [end_point.x, end_point.y])

        intersects = []
        for block in self._blocks:
            intersects += block.get_geometry().intersection(segment)

        if len(intersects) == 0:
            return None

        nearest_point = None
        nearest_distance = None
        for intersect_point in intersects:
            current_distance = math.dist([intersect_point.x, intersect_point.y], [start_point.x, start_point.y])

            if nearest_distance == None or current_distance < nearest_distance:
                nearest_distance = current_distance
                nearest_point = intersect_point

        return Point(int(nearest_point.x), int(nearest_point.y))
