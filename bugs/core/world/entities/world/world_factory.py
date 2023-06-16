from core.world.entities.ant.ant_factory import AntFactory
from core.world.entities.food.food_factory import FoodFactory
from core.world.entities.nest.nest_factory import NestFactory
from core.world.utils.size import Size
from core.world.utils.point import Point
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.map import Map
from .world import World
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.food.food_types import FoodTypes
from core.world.entities.colony.colony_factory import ColonyFactory
from core.world.entities.colony.colony import Colony

class WorldFactory():

    def __init__(self, event_bus: EventEmitter, ant_factory: AntFactory, food_factory: FoodFactory, nest_factory: NestFactory, colony_factory: ColonyFactory):
        self._event_bus = event_bus
        self._ant_factory = ant_factory
        self._food_factory = food_factory
        self._nest_factory = nest_factory
        self._colony_factory = colony_factory

    def build_world_from_json(self, world_data: dict, map: Map):
        nests_data = world_data['nests']
        for nest_data in nests_data:
            position = Point(nest_data['position']['x'], nest_data['position']['y'])
            nest = self._nest_factory.build_nest(nest_data['id'], position, nest_data['color'], nest_data['from_colony'], nest_data['larvae'], nest_data['larva_places_count'])
            map.add_entity(nest)

        ants_data = world_data['ants']
        for ant_data in ants_data:
            position = Point(ant_data['position']['x'], ant_data['position']['y'])
            nest = map.get_entity_by_id(ant_data['from_nest'])
            located_in_nest = None
            if ant_data['located_in_nest'] != None:
                located_in_nest = map.get_entity_by_id(ant_data['located_in_nest'])
            ant_type = AntTypes(ant_data['type'])
            ant = self._ant_factory.build_ant(ant_data['id'], ant_data['from_colony'], ant_type, ant_data['dna_profile'], position, nest, located_in_nest)
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

        colonies_data = world_data['colonies']
        colonies = []
        for colony_data in colonies_data:
            colony = self._colony_factory.build_colony(colony_data['id'], colony_data['owner_id'])
            colonies.append(colony)

        world = self.build_world(map, colonies)
        
        return world
        
    def build_world(self, map: Map, colonies: list[Colony]) -> World:
        return World(map, self._event_bus, colonies)
