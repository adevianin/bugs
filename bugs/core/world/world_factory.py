from .bug import Bug
from .world import World
from pyee.base import EventEmitter
from .point import Point

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
        events = EventEmitter()
        pos = Point(bug_json['pos']['x'], bug_json['pos']['y'])
        return Bug(events, self.main_event_bus, bug_json['id'], pos)
