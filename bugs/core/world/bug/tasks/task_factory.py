from .walk_task import WalkTask
from .search_task import SearchTask
from .find_to_eat_task import FindToEatTask
from .eat_task import EatTask

class TaskFactory():

    def build_walk_task(self, bug_body, map, dest_point):
        return WalkTask(self, bug_body, map, dest_point)

    def build_search_task(self, bug_body, map, entity_type, nearby_town):
        return SearchTask(self, bug_body, map, entity_type, nearby_town)

    def build_find_to_eat_task(self, bug_body, map, nearby_town):
        return FindToEatTask(self, bug_body, map, nearby_town)

    def build_eat_task(self, bug_body, food_entity):
        return EatTask(self, bug_body, food_entity)
