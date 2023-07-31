from core.world.world_repository_interface import iWorldRepository
from core.world.entities.world.world import World
from .world_data_repository import WorldDataRepository
from core.world.entities.base.entity_collection import EntityCollection
from core.data.factories.json_nest_factory import JsonNestFactory
from core.data.factories.json_ant_factory import JsonAntFactory
from core.data.factories.json_food_factory import JsonFoodFactory
from core.data.factories.json_colony_factory import JsonColonyFactory
from core.data.factories.json_thought_factory import JsonThoughtFactory
from core.world.entities.map.map import Map
from core.world.utils.size import Size
from core.world.entities.world.world import World
from core.world.entities.world.world_factory import WorldFactory
from core.world.id_generator import IdGenerator
from core.data.serializers.world_serializer import WorldSerializer
from core.data.factories.json_map_factory import JsonMapFactory
from core.world.entities.colony.colony_relations_table import ColonyRelationsTable

class WorldRepository(iWorldRepository):

    def __init__(self, world_data_repository: WorldDataRepository, nest_factory: JsonNestFactory, ant_factory: JsonAntFactory, food_factory: JsonFoodFactory, colony_factory: JsonColonyFactory, thought_factory: JsonThoughtFactory, json_map_factory: JsonMapFactory, world_factory: WorldFactory, world_serializer: WorldSerializer):
        self._world_data_repository = world_data_repository
        self._json_nest_factory = nest_factory
        self._json_ant_factory = ant_factory
        self._json_food_factory = food_factory
        self._json_colony_factory = colony_factory
        self._json_thought_factory = thought_factory
        self._json_map_factory = json_map_factory
        self._world_factory = world_factory
        self._world_serializer = world_serializer

    def get(self, world_id: int) -> World:
        world_data = self._world_data_repository.get(world_id)

        entities_collection = EntityCollection.build_entity_collection()

        nests_data = world_data['nests']
        for nest_data in nests_data:
            nest = self._json_nest_factory.build_nest_from_json(nest_data)
            entities_collection.add_entity(nest)

        foods_json = world_data['foods']
        for food_json in foods_json:
            food = self._json_food_factory.build_food_from_json(food_json)
            entities_collection.add_entity(food)

        food_areas_json = world_data['food_areas']
        for food_area_json in food_areas_json:
            food_area = self._json_food_factory.build_food_area_from_json(food_area_json)
            entities_collection.add_entity(food_area)

        ants_json = world_data['ants']
        for ant_json in ants_json:
            ant = self._json_ant_factory.build_ant_from_json(ant_json, entities_collection)
            entities_collection.add_entity(ant)

        id_generator = IdGenerator.build_id_generator(world_data['last_used_id'])
        map = self._json_map_factory.build_map_from_json(world_data['map'], id_generator, entities_collection)
        colony_relations_table = ColonyRelationsTable.build_colony_relations_table(world_data['colonies_relations'])

        colonies_json = world_data['colonies']
        colonies = []
        for colony_json in colonies_json:
            colony = self._json_colony_factory.build_colony_from_json(colony_json, entities_collection, map, colony_relations_table)
            colonies.append(colony)

        ants_json = world_data['ants']
        for ant_json in ants_json:
            ant = entities_collection.get_entity_by_id(ant_json['id'])
            thoughts_json = ant_json['thoughts']
            thoughts = []
            for thought_json in thoughts_json:
                thought = self._json_thought_factory.build_thougth_from_json(thought_json, entities_collection)
                thoughts.append(thought)
            ant.mind.set_thoughts(thoughts)
        
        world = self._world_factory.build_world(world_id, entities_collection, map, colonies, id_generator, colony_relations_table)

        return world

    def push(self, world: World):
        world_json = self._world_serializer.serialize(world)
        self._world_data_repository.push(world.id, world_json)