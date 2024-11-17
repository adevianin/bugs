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
from core.world.entities.tree.tree_factory import TreeFactory
from core.world.entities.item.item_areas.item_area_factory import ItemAreaFactory
from core.world.utils.point import Point
from core.world.entities.item.items.base.item_types import ItemTypes
import random
from typing import Dict

class WorldService():

    TREE_HEIGHT = 500
    TREE_WIDTH = 462

    def __init__(self, world_factory: WorldFactory, map_factory: MapFactory, colony_factory: ColonyFactory, climate_factory: ClimateFactory, tree_factory: TreeFactory, 
                 item_area_factory: ItemAreaFactory):
        self._world_factory = world_factory
        self._map_factory = map_factory
        self._colony_factory = colony_factory
        self._climate_factory = climate_factory
        self._tree_factory = tree_factory
        self._item_area_factory = item_area_factory

    def generate_new_world(self) -> World:
        chunk_size = Size(1000, 1000)
        chunk_rows_count = 8
        chunk_cols_count = 8
        map_size = Size(chunk_size.width * chunk_rows_count, chunk_size.height * chunk_cols_count)
        entities_collection = EntityCollection.build()
        map = self._map_factory.build_map(map_size, entities_collection)
        colony_relations_table = ColonyRelationsTable.build_empty()
        ground_beetle_colony = self._colony_factory.build_ground_beetle_colony(GROUND_BEETLE_COLONY_ID, map, colony_relations_table)
        last_used_id = GROUND_BEETLE_COLONY_ID
        colonies = [ground_beetle_colony]
        id_generator = IdGenerator.build_id_generator(last_used_id)
        nuptial_environments = []
        player_stats_list = []
        climate = self._climate_factory.build_climate(1, +1)
        notifications = []
        world = self._world_factory.build_world(id_generator, entities_collection, map, colonies, colony_relations_table, nuptial_environments, player_stats_list, climate, 
                                                0, notifications)
        
        for chunk_col_index in range(chunk_cols_count):
            for chunk_row_index in range(chunk_rows_count):
                chunk_pos = Point(chunk_col_index * chunk_size.width, chunk_row_index * chunk_size.height)
                self._generate_chunk(chunk_pos, chunk_size, world, {
                    'is_left_edge': chunk_col_index == 0,
                    'is_right_edge': chunk_col_index + 1 == chunk_cols_count,
                    'is_top_edge': chunk_row_index == 0,
                    'is_bottom_edge': chunk_row_index + 1 == chunk_rows_count
                })

        return world
    
    def _generate_chunk(self, chunk_pos: Point, chunk_size: Size, world: World, edge_info: Dict):
        trees_count = 0 if any(edge_info.values()) else random.randint(0, 2)
        match(trees_count):
            case 0:
                pass
            case 1:
                self._generate_tree_pack(chunk_pos, chunk_size, world)
            case 2:
                self._generate_tree_pack(chunk_pos, chunk_size, world, 0)
                self._generate_tree_pack(chunk_pos, chunk_size, world, WorldService.TREE_WIDTH + 10)

    def _generate_tree_pack(self, chunk_pos: Point, chunk_size: Size, world: World, x: int = None, y: int = None):
        tree_pos = self._generate_tree_position(chunk_pos, chunk_size, x, y)
        tree = self._tree_factory.build_new_tree(world.generate_id(), tree_pos)
        world.map.add_entity(tree)

        area_size = Size(WorldService.TREE_WIDTH, WorldService.TREE_HEIGHT)

        fertility = random.randint(1, 4)
        stick_area = self._item_area_factory.build_new_item_area(world.generate_id(), tree_pos, area_size, ItemTypes.STICK, fertility, world.current_season)
        world.map.add_entity(stick_area)

        fertility = random.randint(1, 5)
        leaf_area = self._item_area_factory.build_new_item_area(world.generate_id(), tree_pos, area_size, ItemTypes.LEAF, fertility, world.current_season)
        world.map.add_entity(leaf_area)

    def _generate_tree_position(self, chunk_pos: Point, chunk_size: Size, x: int, y: int):
        if y is None:
            min_y = chunk_size.height - WorldService.TREE_HEIGHT + 10
            max_y = chunk_size.height - 10
            y = random.randint(min_y, max_y)
        if x is None:
            min_x = 0
            max_x = chunk_size.width - WorldService.TREE_WIDTH - 10
            x = random.randint(min_x, max_x)

        return Point(chunk_pos.x + x, chunk_pos.y + y)

    # def _generate_trees(self, world: World, id_generator: IdGenerator):
    #     world_size = world.map.size
    #     padding = 500
    #     area_per_tree = 1000000
    #     trees_area = (world_size.width - padding) * (world_size.height - padding)
    #     trees_count = round(trees_area / area_per_tree)
    #     for i in range(trees_count - 1):
    #         id = id_generator.generate_id()
    #         position = world.map.generate_random_point(padding)
    #         tree = self._tree_factory.build_new_tree(id, position)
    #         world.map.add_entity(tree)