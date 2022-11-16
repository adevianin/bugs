from .walk_task import WalkTask
from .search_task import SearchTask

class TaskFactory():

    def __init__(self, map):
        self._map = map

    def build_walk_task(self, bug_body, map, dest_point):
        return WalkTask(bug_body, map, dest_point)

    def build_search_task(self, bug_body, map, entity_type):
        return SearchTask(bug_body, map, entity_type, self)