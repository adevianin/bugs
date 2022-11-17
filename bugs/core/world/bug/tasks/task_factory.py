from .walk_task import WalkTask
from .search_task import SearchTask

class TaskFactory():

    def build_walk_task(self, bug_body, map, dest_point):
        return WalkTask(self, bug_body, map, dest_point)

    def build_search_task(self, bug_body, map, entity_type):
        return SearchTask(self, bug_body, map, entity_type)