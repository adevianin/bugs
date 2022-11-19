from .base_task import BaseTask
import random, math
from ...point import Point

class SearchTask(BaseTask):

    def __init__(self, task_factory, bug_body, map, searched_entity_type):
        super().__init__(task_factory, bug_body)
        self._map = map
        self._walk_task = None
        self._searched_entity_type = searched_entity_type
        self._visited_points = []
        self._search_result = []

    def do_step(self):
        searched_items = self._look_for_searched_item()

        if len(searched_items) > 0:
            self._search_result = searched_items
            self.mark_as_done()
        else:
            if not self._walk_task or self._walk_task.is_done():
                self._walk_task = self._generate_next_walk_task()

            self._walk_task.do_step()

    def get_result(self):
        return self._search_result

    def _generate_next_walk_task(self):
        points = self._generate_points_to_walk()
        points_for_choosing_best = []
        points_for_choosing = []
        for point in points:
            if self._is_point_far_from_visited_points(point):
                points_for_choosing_best.append(point)
            else:
                points_for_choosing.append(point)

        choosed_point = random.choice(points_for_choosing_best if len(points_for_choosing_best) > 0 else points_for_choosing)

        self._visited_points.append(choosed_point)

        task = self._task_factory.build_walk_task(self._bug_body, self._map, choosed_point)

        return task

    def _look_for_searched_item(self):
        return self._map.search_entity_near(self._bug_body.get_position(), self._bug_body.get_sight_distance(), self._searched_entity_type)

    def _generate_points_to_walk(self):
        pos = self._bug_body.get_position()
        dist = self._bug_body.get_distance_can_walk()

        points = []

        points_count = 16
        delta_angle = 360 / points_count
        current_angle = 0
        for _ in range(points_count):
            angle = math.radians(current_angle)
            x = pos.x + dist * math.cos(angle)
            y = pos.y + dist * math.sin(angle)
            points.append(Point(x,y))

            current_angle += delta_angle

        valid_points = []
        for point in points:
            if self._map.validate_point(point):
                valid_points.append(point)

        return valid_points

    def _is_point_far_from_visited_points(self, point):
        sight_dist = self._bug_body.get_sight_distance()

        for visited_point in self._visited_points:
            dist = math.dist([point.x, point.y], [visited_point.x, visited_point.y])
            if dist < sight_dist:
                return False

        return True


