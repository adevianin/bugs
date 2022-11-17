from .world import World
from pyee.base import EventEmitter
from .point import Point
from .size import Size
from .map import Map
from .bug import Bug, BugBody, BugMind, TaskFactory
from .food_grower import FoodGrower
import uuid
from .food import Food

class WorldFactory:

    def __init__(self, main_event_bus):
        self._main_event_bus = main_event_bus

    def build_world(self, world_json):
        self._map = self._build_map(world_json["map"])
        self._task_factory = TaskFactory(self._map)

        bugs = []
        for bug_json in world_json['bugs']:
            bug = self._build_bug_from_json(bug_json)
            bugs.append(bug)
            self._map.add_bug(bug.get_body())

        for food_json in world_json['foods']:
            food = self._build_food_from_json(food_json)
            self._map.add_food(food)

        food_grower = FoodGrower(self._map, self)
        world = World(self._map, bugs, food_grower)

        return world

    def build_bug(self, id, pos):
        bug_body = BugBody(self._main_event_bus, id, pos)
        bug_mind = BugMind(bug_body, self._map, self._task_factory)
        bug = Bug(bug_mind, bug_body)
        return bug

    def build_food(self, id, pos, calories):
        id = id if id else uuid.uuid1().hex
        return Food(self._main_event_bus, id, pos, calories)

    def _build_bug_from_json(self, bug_json):
        pos = Point(bug_json['pos']['x'], bug_json['pos']['y'])
        return self.build_bug(bug_json['id'], pos)

    def _build_food_from_json(self, food_json):
        pos = Point(food_json['pos']['x'], food_json['pos']['y'])
        return self.build_food(food_json['id'], pos, food_json['calories'])

    def _build_map(self, map_json):
        map_width = map_json["size"]["width"]
        map_height = map_json["size"]["height"]
        return Map(Size(map_width, map_height))