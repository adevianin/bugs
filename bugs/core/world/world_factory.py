from .world import World
from .point import Point
from .size import Size
from .map import Map
from .bug import Bug, BugBody, BugMind
from .food_grower import FoodGrower
import uuid
from .food import Food
from .town import Town

class WorldFactory:

    def __init__(self, main_event_bus, task_factory):
        self._main_event_bus = main_event_bus
        self._task_factory = task_factory

    def build_world(self, world_json):
        map = self._build_map(world_json["map"])

        towns_map = {}
        for town_json in world_json['towns']:
            town = self._build_town_from_json(town_json)
            towns_map[town.id] = town
            map.add_town(town)

        bugs = []
        for bug_json in world_json['bugs']:
            bug = self._build_bug_from_json(bug_json, map)
            bugs.append(bug)
            map.add_bug(bug.get_body())

        for food_json in world_json['foods']:
            food = self._build_food_from_json(food_json)
            map.add_food(food)

        food_grower = FoodGrower(map, self)
        world = World(self._main_event_bus, map, bugs, food_grower)

        return world

    def build_bug(self, map, id, pos, town_id):
        id = id if id else self._generate_entity_id()
        town = map.get_town_by_id(town_id)
        bug_body = BugBody(self._main_event_bus, id, pos)
        bug_mind = BugMind(bug_body, map, self._task_factory, town)
        bug = Bug(bug_mind, bug_body)
        return bug

    def build_food(self, id, pos, calories):
        id = id if id else self._generate_entity_id()
        return Food(self._main_event_bus, id, pos, calories)

    def build_town(self, id, pos, color):
        id = id if id else self._generate_entity_id()
        return Town(self._main_event_bus, id, pos, color)

    def _build_bug_from_json(self, bug_json, map):
        pos = Point(bug_json['pos']['x'], bug_json['pos']['y'])
        return self.build_bug(map, bug_json['id'], pos, bug_json['from_town'])

    def _build_food_from_json(self, food_json):
        pos = Point(food_json['pos']['x'], food_json['pos']['y'])
        return self.build_food(food_json['id'], pos, food_json['calories'])

    def _build_town_from_json(self, town_json):
        pos = Point(town_json['pos']['x'], town_json['pos']['y'])
        return self.build_town(town_json['id'], pos, town_json['color'])

    def _build_map(self, map_json):
        map_width = map_json["size"]["width"]
        map_height = map_json["size"]["height"]
        return Map(Size(map_width, map_height))

    def _generate_entity_id(self):
        return uuid.uuid1().hex