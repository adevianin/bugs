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
from core.world.entities.item.item_sources.item_source_factory import ItemSourceFactory
from core.world.entities.item.item_sources.honeydew_item_source.honeydew_item_source_body import HoneydewItemSourceBody
from core.world.entities.tree.tree_body import TreeBody
import random
from typing import Dict

class WorldService():

    TREE_HEIGHT = 500
    TREE_WIDTH = 462
    HONEYDEW_SOURCE_HEIGHT = 110
    HONEYDEW_SOURCE_WIDTH = 90

    def __init__(self, world_factory: WorldFactory, map_factory: MapFactory, colony_factory: ColonyFactory, climate_factory: ClimateFactory, tree_factory: TreeFactory, 
                 item_area_factory: ItemAreaFactory, item_source_factory: ItemSourceFactory):
        self._world_factory = world_factory
        self._map_factory = map_factory
        self._colony_factory = colony_factory
        self._climate_factory = climate_factory
        self._tree_factory = tree_factory
        self._item_area_factory = item_area_factory
        self._item_source_factory = item_source_factory

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
        chunk_type = 0 if any(edge_info.values()) else random.randint(0, 2)
        match(chunk_type):
            case 0:
                self._generate_chunk_type_0(chunk_pos, chunk_size, world, edge_info)
            case 1:
                self._generate_chunk_type_1(chunk_pos, chunk_size, world, edge_info)
            case 2:
                self._generate_chunk_type_2(chunk_pos, chunk_size, world, edge_info)

    def _generate_chunk_type_0(self, chunk_pos: Point, chunk_size: Size, world: World, edge_info: Dict):
        half_chunk_width = int(chunk_size.width / 2)
        half_chunk_height = int(chunk_size.height / 2)
        honeydew_count = random.randint(1, 2)

        rect_size = Size(half_chunk_width, chunk_size.height)
        position = self._randomly_place_obj_in_rect(chunk_pos, rect_size, HoneydewItemSourceBody.SIZE)
        self._build_honeydew_item_source(world, position)

        if honeydew_count > 1:
            rect_size = Size(half_chunk_width, chunk_size.height)
            rect_pos = Point(chunk_pos.x + half_chunk_width, chunk_pos.y)
            position = self._randomly_place_obj_in_rect(rect_pos, rect_size, HoneydewItemSourceBody.SIZE)
            self._build_honeydew_item_source(world, position)

        position = Point(chunk_pos.x + half_chunk_width, chunk_pos.y + half_chunk_height)
        self._build_flower_item_area(world, position, chunk_size)

    def _generate_chunk_type_1(self, chunk_pos: Point, chunk_size: Size, world: World, edge_info: Dict): 
        half_chunk_width = int(chunk_size.width / 2)
        half_chunk_height = int(chunk_size.height / 2)
        is_mirror = random.choice([True, False])
        mirror_x = chunk_pos.x + half_chunk_width

        rect_size = Size(half_chunk_width, chunk_size.height)
        tree_pos = self._randomly_place_obj_in_rect(chunk_pos, rect_size, TreeBody.SIZE)
        if is_mirror:
            tree_pos = tree_pos.mirror_x_axis(mirror_x)
        self._build_tree_pack(world, tree_pos)

        rect_size = Size(half_chunk_width, half_chunk_height)
        rect_pos = Point(chunk_pos.x + half_chunk_width, chunk_pos.y)
        position = self._randomly_place_obj_in_rect(rect_pos, rect_size, HoneydewItemSourceBody.SIZE)
        if is_mirror:
            position = position.mirror_x_axis(mirror_x)
        self._build_honeydew_item_source(world, position)

        rect_size = Size(half_chunk_width, half_chunk_height)
        rect_pos = Point(chunk_pos.x + half_chunk_width, chunk_pos.y + half_chunk_height)
        position = self._randomly_place_obj_in_rect(rect_pos, rect_size, HoneydewItemSourceBody.SIZE)
        if is_mirror:
            position = position.mirror_x_axis(mirror_x)
        self._build_honeydew_item_source(world, position)

    def _generate_chunk_type_2(self, chunk_pos: Point, chunk_size: Size, world: World, edge_info: Dict):
        half_chunk_height = int(chunk_size.height / 2)

        rect_size = Size(chunk_size.width, half_chunk_height + 50)
        tree_pos = self._randomly_place_obj_in_rect(chunk_pos, rect_size, TreeBody.SIZE)
        self._build_tree_pack(world, tree_pos)

        rect_size = Size(chunk_size.width, half_chunk_height - 50)
        rect_pos = Point(chunk_pos.x, chunk_pos.y + half_chunk_height + 50)
        position = self._randomly_place_obj_in_rect(rect_pos, rect_size, HoneydewItemSourceBody.SIZE)
        self._build_honeydew_item_source(world, position)

    def _randomly_place_obj_in_rect(self, rect_pos: Point, rect_size: Size, obj_size: Size, padding: int = 10):
        if obj_size.width + 2 * padding > rect_size.width or obj_size.height + 2 * padding > rect_size.height:
            raise Exception('not corect rect size or obj size')
        min_x = rect_pos.x + int(obj_size.width / 2) + padding
        max_x = rect_pos.x + int(rect_size.width - obj_size.width / 2) - padding
        min_y = rect_pos.y + obj_size.height + padding
        max_y = rect_pos.y + rect_size.height - padding
        return Point(random.randint(min_x, max_x), random.randint(min_y, max_y))
    
    def _build_flower_item_area(self, world: World, position: Point, size: Size):
        fertility = random.randint(1, 4)
        flower_area = self._item_area_factory.build_new_item_area(world.generate_id(), position, size, ItemTypes.FLOWER, fertility, world.current_season)
        world.map.add_entity(flower_area)

    def _build_honeydew_item_source(self, world: World, position: Point):
        fertility = random.randint(1, 7)
        item_source = self._item_source_factory.build_new_honeydew_item_source(world.generate_id(), position, ItemTypes.HONEYDEW, fertility, 10, 40, world.current_season)
        world.map.add_entity(item_source)

    def _build_tree_pack(self, world: World, tree_pos: Point):
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
