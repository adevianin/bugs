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
from core.world.entities.base.entity_types import EntityTypes

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
            nest = self._nest_factory.build_nest_from_json(nest_data)
            map.add_entity(nest)

        ants_json = world_data['ants']
        for ant_json in ants_json:
            ant = self._ant_factory.build_ant_from_json(ant_json)
            map.add_entity(ant)
            
        foods_json = world_data['foods']
        for food_json in foods_json:
            food = self._food_factory.build_food_from_json(food_json)
            map.add_entity(food)

        food_areas_json = world_data['food_areas']
        for food_area_json in food_areas_json:
            food_area = self._food_factory.build_food_area_from_json(food_area_json)
            map.add_entity(food_area)

        colonies_json = world_data['colonies']
        colonies = []
        for colony_json in colonies_json:
            colony = self._colony_factory.build_colony_from_json(colony_json)
            colonies.append(colony)

        world = self.build_world(map, colonies)
        
        return world
        
    def build_world(self, map: Map, colonies: list[Colony]) -> World:
        return World(map, self._event_bus, colonies)
