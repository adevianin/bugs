from .entities.bug.bug_factory import BugFactory
from .entities.food.food_factory import FoodFactory
from .utils.size import Size
from .utils.point import Point
from .utils.event_emiter import EventEmitter
from .map import Map
from .world import World
from .entities.town import Town

class WorldFactory():

    def __init__(self, event_bus: EventEmitter, bug_factory: BugFactory, food_factory: FoodFactory):
        self._event_bus = event_bus
        self._bug_factory = bug_factory
        self._food_factory = food_factory

    def build_world_from_json(self, world_data: dict):
        map_data = world_data['map']
        map = self.build_map(Size(map_data['size']['width'], map_data['size']['height']))

        towns_data = world_data['towns']
        for town_data in towns_data:
            position = Point(town_data['position']['x'], town_data['position']['y'])
            town = self.build_town(town_data['id'], position, town_data['color'])
            map.add_entity(town)

        bugs_data = world_data['bugs']
        for bug_data in bugs_data:
            position = Point(bug_data['position']['x'], bug_data['position']['y'])
            bug = self._bug_factory.build_bug(map, bug_data['id'], position, bug_data['from_town'])
            map.add_entity(bug)

        foods_data = world_data['foods']
        for food_data in foods_data:
            position = Point(food_data['position']['x'], food_data['position']['y'])
            food = self._food_factory.build_food(food_data['id'], position, food_data['calories'])
            map.add_entity(food)

        world = self.build_world(map)
        
        return world
        
    def build_world(self, map: Map) -> World:
        return World(map, self._event_bus)

    def build_map(self, size: Size) -> Map:
        return Map(size)

    def build_town(self, id: str, position: Point, color: str) -> Town:
        return Town(self._event_bus, id, position, color)