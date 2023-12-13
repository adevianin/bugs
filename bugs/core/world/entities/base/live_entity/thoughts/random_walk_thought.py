from core.world.entities.base.live_entity.live_body import LiveBody
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.thought.thought import Thought
from core.world.utils.point import Point
from typing import List
import math, random

class RandomWalkThought(Thought):

    DIRECTIONS_COUNT = 8
    VISITED_POINTS_MEMORY = 5

    def __init__(self, body: LiveBody, center: Point, radius: int, flags: dict, sayback: str):
        super().__init__(body, ThoughtTypes.RANDOM_WALK, flags, sayback)
        self._visited_points = []
        self._center = center
        self._radius = radius

    @property
    def center(self):
        return self._center
    
    @property
    def radius(self):
        return self._radius

    def do_step(self) -> bool:
        super().do_step()
        
        point = self._generat_point_to_walk()

        if not point and self._center:
            self._body.step_to(self._center)
            return
        
        self._body.step_to(point)
        self._add_point_to_visited(self._body.position)
    
    def _generat_point_to_walk(self):
        points: List[Point] = Point.generate_points_around(self._body.position, self.DIRECTIONS_COUNT, self._body.stats.distance_per_step)
        points = list(filter(self._validate_point, points))
        def dist_sum(point: Point):
            dist_sum = 0
            for visited_point in self._visited_points:
                dist_sum += point.dist(visited_point)
            return dist_sum
        points.sort(key=dist_sum, reverse=True)
        points = points[:math.ceil(len(points)/2)]
        if len(points) == 0:
            return None
        point = random.choice(points)
        return point
    
    def _add_point_to_visited(self, point: Point):
        self._visited_points.append(point)
        if len(self._visited_points) >= self.VISITED_POINTS_MEMORY:
            self._visited_points.pop(0)

    def _validate_point(self, point: Point):
        can_walk = self._body.world_interactor.can_walk_to(point)
        has_walking_area = self._center and self._radius
        is_in_walking_area = point.dist(self._center) <= self._radius if has_walking_area else True
        
        return can_walk and is_in_walking_area

