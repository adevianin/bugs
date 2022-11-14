from .world import World
from pyee.base import EventEmitter
from .point import Point
from .size import Size
from .map import Map
from .bug import Bug, BugBody, BugMind, TaskFactory

class WorldFactory:

    def __init__(self, main_event_bus):
        self.main_event_bus = main_event_bus

    def build_world(self, world_json):
        map_width = world_json["map"]["size"]["width"]
        map_height = world_json["map"]["size"]["height"]
        map = Map(Size(map_width, map_height))
        task_factory = self._build_task_factory(map)

        bugs = []
        for bug_json in world_json['bugs']:
            bug = self.build_bug(bug_json, map, task_factory)
            bugs.append(bug)
            map.add_bug(bug.get_body())

        world = World(map, bugs)

        return world

    def build_bug(self, bug_json, map, task_factory):
        # events = EventEmitter()
        pos = Point(bug_json['pos']['x'], bug_json['pos']['y'])
        bug_body = BugBody(bug_json['id'], pos)
        bug_mind = BugMind(bug_body, map, task_factory)
        bug = Bug(self.main_event_bus, bug_mind, bug_body)
        return bug

    def _build_task_factory(self, map):
        return TaskFactory(map)
