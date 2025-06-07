from core.world.entities.base.live_entity.live_body import LiveBody
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.thought.thought import Thought
from core.world.utils.point import Point
from typing import List
import random

class RandomWalkThought(Thought):

    DIRECTIONS_COUNT = 8

    def __init__(self, center: Point, radius: int, flags: dict, sayback: str):
        super().__init__(ThoughtTypes.RANDOM_WALK, flags, sayback)
        self._visited_points = []
        self._center = center
        self._radius = radius
        self._direction_angles_pool = list(range(0, 360, int(360 / RandomWalkThought.DIRECTIONS_COUNT)))
        self._current_direction_index = None

    @property
    def center(self):
        return self._center
    
    @property
    def radius(self):
        return self._radius
    
    def do_step(self) -> bool:
        super().do_step()
        
        point = self._generate_point_to_walk()

        if not point and self._center:
            self._body.step_to(self._center)
            return
        
        self._body.step_to(point)
    
    def _generate_point_to_walk(self):
        smooth_dir_angle_indexes = self._generate_smooth_direction_angle_indexes()
        smooth_point = self._choose_point_from_direction_angle_indexes(smooth_dir_angle_indexes)
        if smooth_point:
            return smooth_point
        else:
            all_dir_angle_indexes = self._generate_all_direction_angle_indexes()
            point = self._choose_point_from_direction_angle_indexes(all_dir_angle_indexes)
            return point
        
    def _choose_point_from_direction_angle_indexes(self, dir_angle_indexes: List[int]) -> Point:
        for dir_angle_index in dir_angle_indexes:
            dir_angle = self._direction_angles_pool[dir_angle_index]
            point = Point.calc_point_by_direction_angle(self._body.position, self._body.stats.distance_per_step, dir_angle)
            if self._validate_point(point):
                self._current_direction_index = dir_angle_index
                return point
            
        return None

    def _generate_smooth_direction_angle_indexes(self):
        dir_angles_count = len(self._direction_angles_pool)

        if self._current_direction_index is None:
            self._current_direction_index = random.randint(0, dir_angles_count - 1)

        prev_idx = (self._current_direction_index - 1) % dir_angles_count
        next_idx = (self._current_direction_index + 1) % dir_angles_count

        indexes = [prev_idx, self._current_direction_index, next_idx]
        random.shuffle(indexes)
        return indexes
    
    def _generate_all_direction_angle_indexes(self):
        indexes = list(range(len(self._direction_angles_pool)))
        random.shuffle(indexes)
        return indexes

    def _validate_point(self, point: Point):
        can_walk = self._body.visual_sensor.can_walk_to(point)
        has_walking_area = self._center and self._radius
        is_in_walking_area = point.dist(self._center) <= self._radius if has_walking_area else True
        
        return can_walk and is_in_walking_area

