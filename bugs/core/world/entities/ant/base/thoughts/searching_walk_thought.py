from core.world.entities.base.live_entity.body import Body
from core.world.entities.thought.thought import Thought
from core.world.utils.point import Point
from core.world.entities.thought.thought_types import ThoughtTypes

import math
import random

class SearchingWalkThought(Thought):

    WALK_DIRECTIONS_COUNT = 8
    VISITED_POINTS_MEMORY = 5

    def __init__(self, body: Body, search_near_point: Point, search_radius: int, flags: dict, sayback: str):
        super().__init__(body=body, type=ThoughtTypes.SEARCHING_WALK, flags=flags, sayback=sayback)
        self._visited_points = []
        self._current_destination_point = None
        self._search_near_point = search_near_point
        self._search_radius = search_radius

    @property
    def searching_near_point(self):
        return self._search_near_point
    
    @property
    def searching_radius(self):
        return self._search_radius

    def do_step(self):
        if (not self._current_destination_point):
            self._current_destination_point = self._generate_point_to_walk()
        
        is_destination_done = self._body.step_to(self._current_destination_point)

        if (is_destination_done): 
            self.add_visited_point(self._current_destination_point)
            self._current_destination_point = None

        return True

    def _generate_point_to_walk(self):
        points = self._generate_potential_points_to_walk()

        if len(points) == 0:
            return self._search_near_point

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
        dist = self._body.distance_per_step
        points_count = SearchingWalkThought.WALK_DIRECTIONS_COUNT

        points = []
        delta_angle = 360 / points_count
        current_angle = 0
        for _ in range(points_count):
            angle = math.radians(current_angle)
            x = round(position.x + dist * math.cos(angle))
            y = round(position.y + dist * math.sin(angle))
            points.append(Point(x,y))

            current_angle += delta_angle

        valid_points = []
        for point in points:
            if self._is_point_inside_searching_area(point): 
                valid_points.append(point)

        return valid_points

    def add_visited_point(self, visited_point: Point):
        self._visited_points.append(visited_point)
        if len(self._visited_points) > SearchingWalkThought.VISITED_POINTS_MEMORY:
            self._visited_points.pop(0)

    def _is_point_inside_searching_area(self, point: Point):
        if (not self._search_near_point):
            return True
        dist_to_search_area_center = math.dist([point.x, point.y], [self._search_near_point.x, self._search_near_point.y])
        return dist_to_search_area_center <= self._search_radius
    