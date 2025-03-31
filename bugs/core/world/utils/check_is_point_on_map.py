from .size import Size
from .point import Point

def check_is_point_on_map(map_size: Size, point: Point):
    is_x_on_map = point.x >= 0 and point.x < map_size.width
    is_y_on_map = point.y >= 0 and point.y < map_size.height

    return is_x_on_map and is_y_on_map