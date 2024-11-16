from core.world.entities.world.world_factory import WorldFactory
from core.world.entities.world.world import World
from core.world.entities.base.entity_collection import EntityCollection
from core.world.entities.map.map_factory import MapFactory
from core.world.utils.size import Size
from core.world.entities.colony.colony_factory import ColonyFactory
from core.world.id_generator import IdGenerator
from core.world.entities.colony.base.colony_relations_table import ColonyRelationsTable
from core.world.settings import GROUND_BEETLE_COLONY_ID
from core.world.entities.climate.climate_factory import ClimateFactory

class WorldService():

    def __init__(self, world_factory: WorldFactory, map_factory: MapFactory, colony_factory: ColonyFactory, climate_factory: ClimateFactory):
        self._world_factory = world_factory
        self._map_factory = map_factory
        self._colony_factory = colony_factory
        self._climate_factory = climate_factory

    def generate_new_world(self) -> World:
        size = Size(3000, 3000)
        entities_collection = EntityCollection.build()
        map = self._map_factory.build_map(size, entities_collection)
        colony_relations_table = ColonyRelationsTable.build_empty()
        ground_beetle_colony = self._colony_factory.build_ground_beetle_colony(GROUND_BEETLE_COLONY_ID, map, colony_relations_table)
        colonies = [ground_beetle_colony]
        id_generator = IdGenerator.build_id_generator(GROUND_BEETLE_COLONY_ID)
        nuptial_environments = []
        player_stats_list = []
        climate = self._climate_factory.build_climate(1, +1)
        notifications = []
        world = self._world_factory.build_world(id_generator, entities_collection, map, colonies, colony_relations_table, nuptial_environments, player_stats_list, climate, 0, notifications)
        return world