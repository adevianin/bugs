from core.world.utils.point import Point
from core.world.utils.size import Size

class UtilClientSerializer():

    def serialize_point(self, point: Point):
        return {
            'x': point.x,
            'y': point.y
        }
    
    def serialize_size(sefl, size: Size):
        return {
            'width': size.width,
            'height': size.height
        }