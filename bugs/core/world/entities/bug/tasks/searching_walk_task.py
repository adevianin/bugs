from core.world.entities.base.live_entity.tasks.task import Task
from ..body import BugBody
from core.world.utils.point import Point
from core.world.map import Map

import math
import random

class SearchingWalkTask(Task):

    WALK_DIRECTIONS_COUNT = 8
    VISITED_POINTS_MEMORY = 3
    WALK_DISTANCE = 40

    def __init__(self, body: BugBody, map: Map):
        super().__init__(body)
        self._map = map
        self._visited_points = []
        self._current_destination_point = None

    def do_step(self):
        if (not self._current_destination_point):
            self._current_destination_point = self._generate_point_to_walk()
        
        is_destination_done = self._body.step_to(self._current_destination_point)

        if (is_destination_done): 
            self.add_visited_point(self._current_destination_point)
            self._current_destination_point = None

    def _generate_point_to_walk(self):
        points = self._generate_potential_points_to_walk()

        def dist_sum(point):
            dist_sum = 0
            for visited_point in self._visited_points:
                dist_sum += math.dist([point.x, point.y], [visited_point.x, visited_point.y])
            return dist_sum
        points.sort(key=dist_sum, reverse=True)
        points = points[:math.ceil(len(points)/2)]

        point = random.choice(points)

        return point

    def _generate_potential_points_to_walk(self):
        position = self._body.position
        dist = SearchingWalkTask.WALK_DISTANCE
        points_count = SearchingWalkTask.WALK_DIRECTIONS_COUNT

        points = []
        delta_angle = 360 / points_count
        current_angle = 0
        for _ in range(points_count):
            angle = math.radians(current_angle)
            x = int(position.x + dist * math.cos(angle))
            y = int(position.y + dist * math.sin(angle))
            points.append(Point(x,y))

            current_angle += delta_angle

        valid_points = []
        for point in points:
            is_point_walkable = self._map.is_point_walkable(point)
            if is_point_walkable: 
                valid_points.append(point)

        return valid_points

    def add_visited_point(self, visited_point: Point):
        self._visited_points.append(visited_point)
        if len(self._visited_points) > SearchingWalkTask.VISITED_POINTS_MEMORY:
            self._visited_points.pop(0)
