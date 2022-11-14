from .walk_task import WalkTask

class TaskFactory():

    def __init__(self, map):
        self._map = map

    def build_walk_task(self, bug_body, map, dest_point):
        return WalkTask(bug_body, map, dest_point)