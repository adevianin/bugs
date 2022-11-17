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
        self.main_event_bus = main_event_bus

    def build_world(self, world_json):
        map_width = world_json["map"]["size"]["width"]
        map_height = world_json["map"]["size"]["height"]
        map = Map(Size(map_width, map_height))
        task_factory = TaskFactory(map)
        food_grower = FoodGrower(map, self)

        bugs = []
        for bug_json in world_json['bugs']:
            bug = self.build_bug(bug_json, map, task_factory)
            bugs.append(bug)
            map.add_bug(bug.get_body())

        for food_json in world_json['foods']:
            food = self._build_food_from_json(food_json)
            map.add_food(food)

        world = World(map, bugs, food_grower)

        return world

    def build_bug(self, bug_json, map, task_factory):
        # events = EventEmitter()
        pos = Point(bug_json['pos']['x'], bug_json['pos']['y'])
        bug_body = BugBody(self.main_event_bus, bug_json['id'], pos)
        bug_mind = BugMind(bug_body, map, task_factory)
        bug = Bug(bug_mind, bug_body)
        return bug

    def build_food(self, id, pos, calories):
        id = id if id else uuid.uuid1().hex
        return Food(self.main_event_bus, id, pos, calories)

    def _build_food_from_json(self, food_json):
        pos = Point(food_json['pos']['x'], food_json['pos']['y'])
        return self.build_food(food_json['id'], pos, food_json['calories'])