from .bug import Bug
from .world import World

class WorldFactory:

    def __init__(self, main_event_bus):
        self.main_event_bus = main_event_bus

    def build_world(self, world_json):
        inited_bugs = []
        for bug_json in world_json['bugs']:
            bug = self.build_bug(bug_json)
            inited_bugs.append(bug)

        world = World(inited_bugs)

        return world

    def build_bug(self, bug_json):
        return Bug(self.main_event_bus, bug_json['id'], bug_json['pos'])
