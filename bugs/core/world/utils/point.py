from collections import namedtuple
from typing import List, Tuple
import math, random

class Point(namedtuple('Point', ['x', 'y'])):

    @classmethod
    def generate_points_around(self, point: 'Point', points_count: int, distance: int) -> List['Point']:
        points = []
        delta_angle = 360 / points_count
        current_angle = 0
        for _ in range(points_count):
            angle = math.radians(current_angle)
            x = round(point.x + distance * math.cos(angle))
            y = round(point.y + distance * math.sin(angle))
            points.append(Point(x,y))

            current_angle += delta_angle

        return points

    @classmethod
    def do_step_on_path(cls, start_point: 'Point', dest_point: 'Point', step_size: int) -> Tuple['Point', int, bool]:
        distance = start_point.dist(dest_point)
        if distance <= step_size:
            passed_dist = distance
            is_walk_done = True
            return dest_point, passed_dist, is_walk_done
        else:
            x_distance = dest_point.x - start_point.x 
            y_distance = dest_point.y - start_point.y
            path_percent_to_walk = (step_size * 100) / distance

            x_shift = x_distance * path_percent_to_walk / 100
            y_shift = y_distance * path_percent_to_walk / 100

            new_pos = Point(start_point.x + x_shift, start_point.y + y_shift)
            is_walk_done = new_pos.is_equal(dest_point)
            if is_walk_done:
                new_pos = dest_point
            passed_dist = step_size

            return new_pos, passed_dist, is_walk_done

    @classmethod
    def calculate_angle_to_x_axis(cls, point1: 'Point', point2: 'Point'):
        delta_x = point2.x - point1.x
        delta_y = point2.y - point1.y
        angle_radians = math.atan2(delta_y, delta_x)
        angle_degrees = math.degrees(angle_radians)
        if angle_degrees < 0:
            angle_degrees += 360

        return angle_degrees
    
    @staticmethod
    def generate_random_point_on_circle(center: 'Point', radius: int):
        angle = random.uniform(0, 2 * math.pi)
        x = center.x + radius * math.cos(angle)
        y = center.y + radius * math.sin(angle)
        return Point(x, y)

    @classmethod
    def from_json(cls, point_json: List[int]):
        return Point(point_json[0], point_json[1])
    
    def mirror_x_axis(self, mirror_x: int):
        return Point(2 * mirror_x - self.x, self.y)
    
    def mirror_y_axis(self, mirror_y: int):
        return Point(self.x, 2 * mirror_y - self.y)
    
    def dist(self, another_point: 'Point'):
        return math.dist([self.x, self.y], [another_point.x, another_point.y])
    
    def is_same(self, another_point: 'Point'):
        return self.x == another_point.x and self.y == another_point.y
    
    def is_equal(self, another_point: 'Point', accurancy: int = 1):
        dist = self.dist(another_point)
        return dist <= accurancy
    
    def rotate(self, angle_degrees, center: 'Point'):
        angle_radians = math.radians(angle_degrees)
        x = self.x - center.x
        y = self.y - center.y
        
        new_x = x * math.cos(angle_radians) - y * math.sin(angle_radians)
        new_y = x * math.sin(angle_radians) + y * math.cos(angle_radians)
        
        new_x += center[0]
        new_y += center[1]
        
        return Point(new_x, new_y)
    