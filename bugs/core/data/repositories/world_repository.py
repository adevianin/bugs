from core.world.world_repository_interface import iWorldRepository
from core.world.entities.world.world import World
from .world_data_repository import WorldDataRepository
from core.world.entities.base.entity_collection import EntityCollection
from core.data.factories.json_nest_factory import JsonNestFactory
from core.data.factories.json_ant_factory import JsonAntFactory
from core.data.factories.json_colony_factory import JsonColonyFactory
from core.data.factories.json_thought_factory import JsonThoughtFactory
from core.world.entities.world.world import World
from core.world.entities.world.world_factory import WorldFactory
from core.data.serializers.world_serializer import WorldSerializer
from core.data.factories.json_map_factory import JsonMapFactory
from core.world.entities.colony.base.colony_relations_table import ColonyRelationsTable
from core.world.entities.ant.base.ant import Ant
from core.data.factories.json_ground_beetle_factory import JsonGroundBeetleFactory
from core.world.entities.ground_beetle.ground_beetle import GroundBeetle
from core.data.factories.json_item_factory import JsonItemFactory
from core.data.factories.json_item_source_factory import JsonItemSourceFactory
from core.data.factories.json_item_area_factory import JsonItemAreaFactory
from core.data.factories.json_nuptial_environment_factory import JsonNuptialEnvironmentFactory

class WorldRepository(iWorldRepository):

    def __init__(self, world_data_repository: WorldDataRepository, nest_factory: JsonNestFactory, ant_factory: JsonAntFactory, colony_factory: JsonColonyFactory, 
                 thought_factory: JsonThoughtFactory, json_map_factory: JsonMapFactory, world_factory: WorldFactory, json_ground_beetle_factory: JsonGroundBeetleFactory, 
                 json_item_factory: JsonItemFactory, json_item_source_factory: JsonItemSourceFactory, json_item_area_factory: JsonItemAreaFactory, 
                 json_nuptial_environment_factory: JsonNuptialEnvironmentFactory, world_serializer: WorldSerializer):
        self._world_data_repository = world_data_repository
        self._json_nest_factory = nest_factory
        self._json_ant_factory = ant_factory
        self._json_colony_factory = colony_factory
        self._json_thought_factory = thought_factory
        self._json_map_factory = json_map_factory
        self._json_ground_beetle_factory = json_ground_beetle_factory
        self._json_item_factory = json_item_factory
        self._json_item_source_factory = json_item_source_factory
        self._json_item_area_factory = json_item_area_factory
        self._json_nuptial_environment_factory = json_nuptial_environment_factory
        self._world_factory = world_factory
        self._world_serializer = world_serializer

    def get(self, world_id: int) -> World:
        world_data = self._world_data_repository.get(world_id)

        entities_collection = EntityCollection.build_entity_collection()

        nests_data = world_data['nests']
        for nest_data in nests_data:
            nest = self._json_nest_factory.build_nest_from_json(nest_data)
            entities_collection.add_entity(nest)

        items_json = world_data['items']
        for item_json in items_json:
            item = self._json_item_factory.build_item_from_json(item_json)
            entities_collection.add_entity(item)

        item_areas_json = world_data['item_areas']
        for item_area_json in item_areas_json:
            item_area = self._json_item_area_factory.build_item_area_from_json(item_area_json)
            entities_collection.add_entity(item_area)

        item_sources_json = world_data['item_sources']
        for item_source_json in item_sources_json:
            item_source = self._json_item_source_factory.build_item_source_from_json(item_source_json)
            entities_collection.add_entity(item_source)

        ground_beetles_json = world_data['ground_beetles']
        for ground_beetle_json in ground_beetles_json:
            ground_beetle = self._json_ground_beetle_factory.build_ground_beetle_from_json(ground_beetle_json, entities_collection)
            entities_collection.add_entity(ground_beetle)

        ants_json = world_data['ants']
        for ant_json in ants_json:
            ant = self._json_ant_factory.build_ant_from_json(ant_json, entities_collection)
            entities_collection.add_entity(ant)

        ants_json = world_data['ants']
        for ant_json in ants_json:
            ant: Ant = entities_collection.get_entity_by_id(ant_json['id'])
            thoughts_json = ant_json['thoughts']
            thoughts = []
            for thought_json in thoughts_json:
                thought = self._json_thought_factory.build_thougth_from_json(ant.body, thought_json, entities_collection)
                thoughts.append(thought)
            ant.mind.set_thoughts(thoughts)

        ground_beetles_json = world_data['ground_beetles']
        for ground_beetle_json in ground_beetles_json:
            ground_beetle: GroundBeetle = entities_collection.get_entity_by_id(ground_beetle_json['id'])
            thoughts_json = ground_beetle_json['thoughts']
            thoughts = []
            for thought_json in thoughts_json:
                thought = self._json_thought_factory.build_thougth_from_json(ground_beetle.body, thought_json, entities_collection)
                thoughts.append(thought)
            ground_beetle.mind.set_thoughts(thoughts)

        map = self._json_map_factory.build_map_from_json(world_data['map'], entities_collection)
        colony_relations_table = ColonyRelationsTable.build_colony_relations_table(world_data['colonies_relations'])

        colonies_json = world_data['colonies']
        colonies = []
        for colony_json in colonies_json:
            colony = self._json_colony_factory.build_colony_from_json(colony_json, entities_collection, map, colony_relations_table)
            colonies.append(colony)

        nuptial_environments_json = world_data['nuptial_environments']
        nuptial_environments = []
        for nuptial_environment_json in nuptial_environments_json:
            nuptial_environment = self._json_nuptial_environment_factory.build_nuptial_environment_from_json(nuptial_environment_json)
            nuptial_environments.append(nuptial_environment)

        world = self._world_factory.build_world(world_id, world_data['last_used_id'], entities_collection, map, colonies, colony_relations_table, nuptial_environments)

        return world

    def push(self, world: World):
        world_json = self._world_serializer.serialize(world)
        self._world_data_repository.push(world.id, world_json)