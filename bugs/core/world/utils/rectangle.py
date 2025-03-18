from .point import Point
from .size import Size

class Rectangle():

    @staticmethod
    def build(x, y, width, height):
        return Rectangle(Point(x,y), Size(width, height))
    
    def __init__(self, position: Point, size: Size):
        self._position: Point = position
        self._size: Size = size

    @property
    def position(self):
        return self._position

    @property
    def size(self):
        return self._size

    def contains(self, point: Point) -> bool:
        minX = self.position.x
        maxX = self.position.x + self.size.width
        minY = self.position.y
        maxY = self.position.y + self.size.height

        return (
            point.x >= minX and point.x < maxX and
            point.y >= minY and point.y < maxY 
        )
    
    def intersects(self, other: 'Rectangle') -> bool:
        myMinX = self.position.x 
        myMaxX = self.position.x + self.size.width - 1
        myMinY = self.position.y
        myMaxY = self.position.y + self.size.height - 1

        otherMinX = other.position.x
        otherMaxX = other.position.x + other.size.width - 1
        otherMinY = other.position.y
        otherMaxY = other.position.y + other.size.height - 1

        return not (
            myMaxX < otherMinX or
            myMinX > otherMaxX or
            myMaxY < otherMinY or
            myMinY > otherMaxY
        )