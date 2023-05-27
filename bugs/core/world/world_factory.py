from .entities.ant.ant_factory import AntFactory
from .entities.food.food_factory import FoodFactory
from .entities.town.town_factory import TownFactory
from .utils.size import Size
from .utils.point import Point
from .utils.event_emiter import EventEmitter
from .map import Map
from .world import World
from .entities.ant.base.ant_types import AntTypes
from .entities.food.food_types import FoodTypes

class WorldFactory():

    def __init__(self, event_bus: EventEmitter, ant_factory: AntFactory, food_factory: FoodFactory, town_factory: TownFactory):
        self._event_bus = event_bus
        self._ant_factory = ant_factory
        self._food_factory = food_factory
        self._town_factory = town_factory

    def build_world_from_json(self, world_data: dict, map: Map):
        towns_data = world_data['towns']
        for town_data in towns_data:
            position = Point(town_data['position']['x'], town_data['position']['y'])
            town = self._town_factory.build_town(town_data['id'], position, town_data['color'], town_data['owner_id'], town_data['larvae'], town_data['larva_places_count'])
            map.add_entity(town)

        ants_data = world_data['ants']
        for ant_data in ants_data:
            position = Point(ant_data['position']['x'], ant_data['position']['y'])
            town = map.get_entity_by_id(ant_data['from_town'])
            ant_type = AntTypes(ant_data['type'])
            ant = self._ant_factory.build_ant(ant_data['id'], ant_type, position, town)
            map.add_entity(ant)

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
            food_area = self._food_factory.build_food_area(food_area_data['id'], position, size, food_area_data['fertility'], food_type)
            map.add_entity(food_area)

        world = self.build_world(map)
        
        return world
        
    def build_world(self, map: Map) -> World:
        return World(map, self._event_bus)
