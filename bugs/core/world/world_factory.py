from .entities.bug.bug_factory import BugFactory
from .entities.food.food_factory import FoodFactory
from .utils.size import Size
from .utils.point import Point
from .utils.event_emiter import EventEmitter
from .map import Map
from .world import World
from .entities.town import Town
from .entities.food.food_area import FoodArea
from .entities.bug.base.bug_types import BugTypes
from .entities.food.food_types import FoodTypes
from core.world.action.action_accumulator import ActionAccumulator

class WorldFactory():

    def __init__(self, event_bus: EventEmitter, bug_factory: BugFactory, food_factory: FoodFactory, action_accumulator: ActionAccumulator):
        self._event_bus = event_bus
        self._bug_factory = bug_factory
        self._food_factory = food_factory
        self._action_accumulator = action_accumulator

    def build_world_from_json(self, world_data: dict):
        map_data = world_data['map']
        map = self.build_map(Size(map_data['size']['width'], map_data['size']['height']))

        towns_data = world_data['towns']
        for town_data in towns_data:
            position = Point(town_data['position']['x'], town_data['position']['y'])
            town = self.build_town(town_data['id'], position, town_data['color'], town_data['owner_id'])
            map.add_entity(town)

        bugs_data = world_data['bugs']
        for bug_data in bugs_data:
            position = Point(bug_data['position']['x'], bug_data['position']['y'])
            town = map.get_entity_by_id(bug_data['from_town'])
            bug_type = BugTypes(bug_data['type'])
            bug = self._bug_factory.build_bug(map, bug_data['id'], bug_type, position, town)
            map.add_entity(bug)

        foods_data = world_data['foods']
        for food_data in foods_data:
            position = Point(food_data['position']['x'], food_data['position']['y'])
            food_type = FoodTypes(food_data['type'])
            food = self._food_factory.build_food(food_data['id'], position, food_data['calories'], food_type, food_data['food_variety'])
            map.add_entity(food)

        food_areas_data = world_data['food_areas']
        for food_area_data in food_areas_data:
            position = Point(food_area_data['position']['x'], food_area_data['position']['y'])
            size = Size(food_area_data['size']['width'], food_area_data['size']['height'])
            food_type = FoodTypes(food_area_data['food_type'])
            food_area = self.build_food_area(food_area_data['id'], position, size, food_area_data['fertility'], food_type)
            map.add_entity(food_area)

        world = self.build_world(map)
        
        return world
        
    def build_world(self, map: Map) -> World:
        return World(map, self._event_bus, self._action_accumulator)

    def build_map(self, size: Size) -> Map:
        return Map(size, self._event_bus, self._action_accumulator)

    def build_town(self, id: int, position: Point, color: str, owner_id: int) -> Town:
        return Town(self._event_bus, id, position, color, owner_id)

    def build_food_area(self, id: int, position: Point, size: Size, fertility: int, food_type: FoodTypes):
        return FoodArea(self._event_bus, id, position, size, self._food_factory, fertility, food_type)