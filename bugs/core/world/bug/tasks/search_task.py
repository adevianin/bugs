from .base_task import BaseTask
import random, math
from ...point import Point

class SearchTask(BaseTask):

    VISITED_POINTS_MEMORY = 3
    POSSIBLE_WALK_POINTS_COUNT = 8

    def __init__(self, task_factory, bug_body, map, searched_entity_type):
        super().__init__(task_factory, bug_body)
        self._map = map
        self._walk_task = None
        self._searched_entity_type = searched_entity_type
        self._visited_points = []
        self._search_result = []

    def do_step(self):
        searched_items = self._look_for_searched_item()
        has_found_items = len(searched_items) > 0

        if has_found_items:
            self._search_result = searched_items
            self.mark_as_done()
        else:
            self._do_search_task()

    def get_result(self):
        return self._search_result

    def _do_search_task(self):
        if not self._walk_task or self._walk_task.is_done():
            self._walk_task = self._generate_next_walk_task()

        self._walk_task.do_step()

    def _generate_next_walk_task(self):
        points = self._generate_points_to_walk()

        def dist_sum(point):
            dist_sum = 0
            for visited_point in self._visited_points:
                dist_sum += math.dist([point.x, point.y], [visited_point.x, visited_point.y])
            return dist_sum

        points.sort(key=dist_sum, reverse=True)
        points = points[:math.ceil(len(points)/2)]

        choosed_point = random.choice(points)

        self._visited_points.append(choosed_point)

        if len(self._visited_points) > SearchTask.VISITED_POINTS_MEMORY:
            self._visited_points.pop(0)

        task = self._task_factory.build_walk_task(self._bug_body, self._map, choosed_point)

        return task

    def _look_for_searched_item(self):
        return self._map.search_entity_near(self._bug_body.get_position(), self._bug_body.get_sight_distance(), self._searched_entity_type)

    def _generate_points_to_walk(self):
        pos = self._bug_body.get_position()
        dist = self._bug_body.get_max_distance_can_walk_per_step()

        points = []

        points_count = SearchTask.POSSIBLE_WALK_POINTS_COUNT
        delta_angle = 360 / points_count
        current_angle = 0
        for _ in range(points_count):
            angle = math.radians(current_angle)
            x = int(pos.x + dist * math.cos(angle))
            y = int(pos.y + dist * math.sin(angle))
            points.append(Point(x,y))

            current_angle += delta_angle

        valid_points = []
        for point in points:
            if self._map.validate_point(point):
                valid_points.append(point)

        return valid_points


