from .point import Point
import random

class Map:

    def __init__(self, size):
        self._size = size
        self._bugs = []
        self._foods = []

    def add_bug(self, bug):
        self._bugs.append(bug)

    def get_bugs(self):
        return self._bugs

    def get_size(self):
        return self._size

    def add_food(self, food):
        self._foods.append(food)

    def get_foods(self):
        return self._foods

    def validate_point(self, point):
        is_x_valid = point.x >= 0 and point.x <= self._size.width
        is_y_valid = point.y >= 0 and point.y <= self._size.height

        return is_x_valid and is_y_valid

    def get_random_position(self):
        x = random.randint(0, self._size.width)
        y = random.randint(0, self._size.height)
        return Point(x, y)
