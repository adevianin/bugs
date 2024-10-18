from core.world.world_repository_interface import iWorldRepository
from core.world.entities.world.world import World
from .world_data_repository import WorldDataRepository
from core.world.entities.base.entity_collection import EntityCollection
from core.world.entities.world.world import World
from core.world.entities.world.world_factory import WorldFactory
from core.data.serializers.world_serializer import WorldSerializer
from core.world.entities.colony.base.colony_relations_table import ColonyRelationsTable
from core.world.entities.ant.base.ant import Ant
from core.world.entities.ground_beetle.ground_beetle import GroundBeetle
from core.data.deserializers.map_deserializer import MapDeserializer
from core.data.deserializers.item_deserializer import ItemDeserializer
from core.data.deserializers.item_source_deserializer import ItemSourceDeserializer
from core.data.deserializers.item_area_deserializer import ItemAreaDeserializer
from core.data.deserializers.nuptial_environment_deserializer import NuptialEnvironmentDeserializer
from core.data.deserializers.climate_deserializer import ClimateDeserializer
from core.data.deserializers.nest_deserializer import NestDeserializer
from core.data.deserializers.ant_deserializer import AntDeserializer
from core.data.deserializers.colony_deserializer import ColonyDeserializer
from core.data.deserializers.thought_deserializer import ThoughtDeserializer
from core.data.deserializers.ground_beetle_deserializer import GroundBeetleDeserializer
from core.world.entities.base.live_entity.live_entity import LiveEntity

class WorldRepository(iWorldRepository):

    def __init__(self, world_data_repository: WorldDataRepository, nest_deserializer: NestDeserializer, ant_deserializer: AntDeserializer, colony_deserializer: ColonyDeserializer, 
                 thought_deserializer: ThoughtDeserializer, map_deserializer: MapDeserializer, world_factory: WorldFactory, ground_beetle_deserializer: GroundBeetleDeserializer, 
                 item_deserializer: ItemDeserializer, item_source_deserializer: ItemSourceDeserializer, item_area_deserializer: ItemAreaDeserializer, 
                 nuptial_environment_deserializer: NuptialEnvironmentDeserializer, climate_deserializer: ClimateDeserializer, world_serializer: WorldSerializer):
        self._world_data_repository = world_data_repository
        self._nest_deserializer = nest_deserializer
        self._ant_deserializer = ant_deserializer
        self._colony_deserializer = colony_deserializer
        self._thought_deserializer = thought_deserializer
        self._map_deserializer = map_deserializer
        self._ground_beetle_deserializer = ground_beetle_deserializer
        self._item_deserializer = item_deserializer
        self._item_source_deserializer = item_source_deserializer
        self._item_area_deserializer = item_area_deserializer
        self._nuptial_environment_deserializer = nuptial_environment_deserializer
        self._climate_deserializer = climate_deserializer
        self._world_factory = world_factory
        self._world_serializer = world_serializer

    def get(self, world_id: int) -> World:
        world_data = self._world_data_repository.get(world_id)

        entities_collection = EntityCollection.build_entity_collection()

        nests_data = world_data['nests']
        for nest_data in nests_data:
            nest = self._nest_deserializer.deserialize_nest(nest_data)
            entities_collection.add_entity(nest)

        items_json = world_data['items']
        for item_json in items_json:
            item = self._item_deserializer.deserialize_item(item_json)
            entities_collection.add_entity(item)

        item_areas_json = world_data['item_areas']
        for item_area_json in item_areas_json:
            item_area = self._item_area_deserializer.deserialize_item_area(item_area_json)
            entities_collection.add_entity(item_area)

        item_sources_json = world_data['item_sources']
        for item_source_json in item_sources_json:
            item_source = self._item_source_deserializer.deserialize_item_source(item_source_json)
            entities_collection.add_entity(item_source)

        ground_beetles_json = world_data['ground_beetles']
        for ground_beetle_json in ground_beetles_json:
            ground_beetle = self._ground_beetle_deserializer.deserialize_ground_beetle(ground_beetle_json, entities_collection)
            entities_collection.add_entity(ground_beetle)

        ants_json = world_data['ants']
        for ant_json in ants_json:
            ant = self._ant_deserializer.deserialize_ant(ant_json, entities_collection)
            entities_collection.add_entity(ant)

        # need to be after init all entities
        for thought_pack in world_data['thought_packs']:
            entity: LiveEntity = entities_collection.get_entity_by_id(thought_pack['entity_id'])
            thoughts = []
            for thought_json in thought_pack['thoughts']:
                thought = self._thought_deserializer.deserialize_thougth(entity.body, thought_json, entities_collection)
                thoughts.append(thought)
            entity.set_thoughts(thoughts)

        map = self._map_deserializer.deserialize_map(world_data['map'], entities_collection)
        colony_relations_table = ColonyRelationsTable.build_colony_relations_table(world_data['colonies_relations'])

        colonies_json = world_data['colonies']
        colonies = []
        for colony_json in colonies_json:
            colony = self._colony_deserializer.deserialize_colony(colony_json, entities_collection, map, colony_relations_table)
            colonies.append(colony)

        nuptial_environments_json = world_data['nuptial_environments']
        nuptial_environments = []
        for nuptial_environment_json in nuptial_environments_json:
            nuptial_environment = self._nuptial_environment_deserializer.deserialize_nuptial_environment(nuptial_environment_json)
            nuptial_environments.append(nuptial_environment)

        climate = self._climate_deserializer.deserialize_climate(world_data['climate'])

        last_used_id = world_data['last_used_id']
        current_step = world_data['current_step']
        world = self._world_factory.build_world(world_id, last_used_id, entities_collection, map, colonies, colony_relations_table, nuptial_environments, climate, current_step)

        return world

    def push(self, world: World):
        world_json = self._world_serializer.serialize(world)
        self._world_data_repository.push(world.id, world_json)