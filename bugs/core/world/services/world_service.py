from .base_service import BaseService
from core.world.entities.world.world_factory import WorldFactory
from core.world.entities.world.world import World
from core.world.entities.base.entity_collection import EntityCollection
from core.world.entities.map.map_factory import MapFactory
from core.world.utils.size import Size
from core.world.entities.colony.colony_factory import ColonyFactory
from core.world.entities.colony.base.colony_relations_table import ColonyRelationsTable
from core.world.settings import LADYBUG_COLONY_ID
from core.world.entities.climate.climate_factory import ClimateFactory
from core.world.entities.tree.tree_factory import TreeFactory
from core.world.entities.item.item_areas.item_area_factory import ItemAreaFactory
from core.world.utils.point import Point
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.entities.item.item_sources.item_source_factory import ItemSourceFactory
from core.world.entities.item.item_sources.honeydew_item_source.honeydew_item_source_body import HoneydewItemSourceBody
from core.world.entities.tree.tree_body import TreeBody
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.item.item_areas.base.item_area import ItemArea
import random
from typing import Dict, Callable, Iterator, Tuple

class WorldService(BaseService):

    CHUNK_SIZE = Size(1000, 1000)

    def __init__(self, event_bus, world_factory: WorldFactory, map_factory: MapFactory, colony_factory: ColonyFactory, climate_factory: ClimateFactory, 
                 tree_factory: TreeFactory, item_area_factory: ItemAreaFactory, item_source_factory: ItemSourceFactory):
        super().__init__(event_bus)
        self._world_factory = world_factory
        self._map_factory = map_factory
        self._colony_factory = colony_factory
        self._climate_factory = climate_factory
        self._tree_factory = tree_factory
        self._item_area_factory = item_area_factory
        self._item_source_factory = item_source_factory

    def expand_current_map(self, expand_chunk_rows: int, expand_chunk_cols: int):
        if self._world.is_world_running:
            return 'world must be stopped before expanding'
        
        before_expand_chunk_rows_count = int(self._world.map.size.width / WorldService.CHUNK_SIZE.width)
        before_expand_chunk_cols_count = int(self._world.map.size.height / WorldService.CHUNK_SIZE.height)
        before_expand_last_row_index = before_expand_chunk_rows_count - 1
        before_expand_last_col_index = before_expand_chunk_cols_count - 1
        after_expand_chunk_rows_count = before_expand_chunk_rows_count + expand_chunk_rows
        after_expand_chunk_cols_count = before_expand_chunk_cols_count + expand_chunk_cols

        for chunk_position, indexes, edge_info in self._chunks_positions(before_expand_chunk_rows_count, before_expand_chunk_cols_count):
            if edge_info['is_right_edge'] or edge_info['is_bottom_edge']:
                self._clear_flower_item_area_in_chunk(chunk_position, self._world)
                self._generate_chunk(chunk_position, self._world, edge_info)

        for chunk_position, indexes, edge_info in self._chunks_positions(after_expand_chunk_rows_count, after_expand_chunk_cols_count):
            if indexes['row_index'] > before_expand_last_row_index or indexes['col_index'] > before_expand_last_col_index:
                self._generate_chunk(chunk_position, self._world, edge_info)

        self._world.map.size = self._calc_map_size(after_expand_chunk_cols_count, after_expand_chunk_rows_count)

        return None
    
    def build_new_empty_world(self, chunk_cols_count: int, chunk_rows_count: int) -> World:
        map_size = self._calc_map_size(chunk_cols_count, chunk_rows_count)
        entities_collection = EntityCollection.build()
        map = self._map_factory.build_map(map_size, entities_collection)
        colony_relations_table = ColonyRelationsTable.build_empty()
        ladybug_colony = self._colony_factory.build_ladybug_colony(LADYBUG_COLONY_ID, map, colony_relations_table)
        last_used_id = LADYBUG_COLONY_ID
        colonies = [ladybug_colony]
        nuptial_environments = []
        player_stats_list = []
        climate = self._climate_factory.build_climate(1, +1)
        notifications = []
        world = self._world_factory.build_world(map, colonies, colony_relations_table, nuptial_environments, player_stats_list, climate, 
                                                0, notifications, last_used_id)
        
        return world

    def populate_empty_world(self, world: World):
        chunk_rows_count = int(world.map.size.width / self.CHUNK_SIZE.width)
        chunk_cols_count = int(world.map.size.height / self.CHUNK_SIZE.height)
        
        for chunk_position, indexes, edge_info in self._chunks_positions(chunk_rows_count, chunk_cols_count):
            self._generate_chunk(chunk_position, world, edge_info)

        return world
    
    def _chunks_positions(self, chunk_rows_count: int, chunk_cols_count: int) -> Iterator[Tuple[Point, Dict, Dict]]:
        for chunk_col_index in range(chunk_cols_count):
            for chunk_row_index in range(chunk_rows_count):
                chunk_position = Point(chunk_col_index * WorldService.CHUNK_SIZE.width, chunk_row_index * WorldService.CHUNK_SIZE.height)
                edge_info = {
                    'is_left_edge': chunk_col_index == 0,
                    'is_right_edge': chunk_col_index + 1 == chunk_cols_count,
                    'is_top_edge': chunk_row_index == 0,
                    'is_bottom_edge': chunk_row_index + 1 == chunk_rows_count
                }
                indexes = {
                    'row_index': chunk_row_index,
                    'col_index': chunk_col_index
                }
                yield (chunk_position, indexes, edge_info)

    def _clear_flower_item_area_in_chunk(self, chunk_pos: Point, world: World):
        flower_area_filter: Callable[[ItemArea], bool] = lambda item_area: item_area.item_type == ItemTypes.FLOWER and self._check_is_point_inside_chunk(item_area.position, chunk_pos)
        item_areas = world.map.get_entities(entity_types=[EntityTypes.ITEM_AREA], filter=flower_area_filter)
        for item_area in item_areas:
            item_area.simple_die()
    
    def _generate_chunk(self, chunk_pos: Point, world: World, edge_info: Dict):
        chunk_type = 0 if any(edge_info.values()) else random.randint(0, 3)
        match(chunk_type):
            case 0:
                self._generate_chunk_type_0(chunk_pos, world, edge_info)
            case 1:
                self._generate_chunk_type_1(chunk_pos, world, edge_info)
            case 2:
                self._generate_chunk_type_2(chunk_pos, world, edge_info)
            case 3:
                self._generate_chunk_type_3(chunk_pos, world, edge_info)

    def _generate_chunk_type_0(self, chunk_pos: Point, world: World, edge_info: Dict):
        half_chunk_width = int(WorldService.CHUNK_SIZE.width / 2)
        half_chunk_height = int(WorldService.CHUNK_SIZE.height / 2)

        position = Point(chunk_pos.x + half_chunk_width, chunk_pos.y + half_chunk_height)
        size = Size(WorldService.CHUNK_SIZE.width - 10, WorldService.CHUNK_SIZE.height - 10)
        self._build_flower_item_area(world, position, size)

    def _generate_chunk_type_1(self, chunk_pos: Point, world: World, edge_info: Dict):
        half_chunk_width = int(WorldService.CHUNK_SIZE.width / 2)
        half_chunk_height = int(WorldService.CHUNK_SIZE.height / 2)
        honeydew_count = random.randint(1, 2)

        rect_size = Size(half_chunk_width, WorldService.CHUNK_SIZE.height)
        position = self._randomly_place_obj_in_rect(chunk_pos, rect_size, HoneydewItemSourceBody.SIZE)
        self._build_random_food_source(world, position)

        if honeydew_count > 1:
            rect_size = Size(half_chunk_width, WorldService.CHUNK_SIZE.height)
            rect_pos = Point(chunk_pos.x + half_chunk_width, chunk_pos.y)
            position = self._randomly_place_obj_in_rect(rect_pos, rect_size, HoneydewItemSourceBody.SIZE)
            self._build_random_food_source(world, position)

        position = Point(chunk_pos.x + half_chunk_width, chunk_pos.y + half_chunk_height)
        size = Size(WorldService.CHUNK_SIZE.width - 10, WorldService.CHUNK_SIZE.height - 10)
        self._build_flower_item_area(world, position, size)

    def _generate_chunk_type_2(self, chunk_pos: Point, world: World, edge_info: Dict): 
        half_chunk_width = int(WorldService.CHUNK_SIZE.width / 2)
        half_chunk_height = int(WorldService.CHUNK_SIZE.height / 2)
        is_mirror = random.choice([True, False])
        mirror_x = chunk_pos.x + half_chunk_width

        rect_size = Size(half_chunk_width, WorldService.CHUNK_SIZE.height)
        tree_pos = self._randomly_place_obj_in_rect(chunk_pos, rect_size, TreeBody.SIZE)
        if is_mirror:
            tree_pos = tree_pos.mirror_x_axis(mirror_x)
        self._build_tree_pack(world, tree_pos)

        rect_size = Size(half_chunk_width, half_chunk_height)
        rect_pos = Point(chunk_pos.x + half_chunk_width, chunk_pos.y)
        position = self._randomly_place_obj_in_rect(rect_pos, rect_size, HoneydewItemSourceBody.SIZE)
        if is_mirror:
            position = position.mirror_x_axis(mirror_x)
        self._build_random_food_source(world, position)

        rect_size = Size(half_chunk_width, half_chunk_height)
        rect_pos = Point(chunk_pos.x + half_chunk_width, chunk_pos.y + half_chunk_height)
        position = self._randomly_place_obj_in_rect(rect_pos, rect_size, HoneydewItemSourceBody.SIZE)
        if is_mirror:
            position = position.mirror_x_axis(mirror_x)
        self._build_random_food_source(world, position)

    def _generate_chunk_type_3(self, chunk_pos: Point, world: World, edge_info: Dict):
        half_chunk_height = int(WorldService.CHUNK_SIZE.height / 2)

        rect_size = Size(WorldService.CHUNK_SIZE.width, half_chunk_height + 50)
        tree_pos = self._randomly_place_obj_in_rect(chunk_pos, rect_size, TreeBody.SIZE)
        self._build_tree_pack(world, tree_pos)

        rect_size = Size(WorldService.CHUNK_SIZE.width, half_chunk_height - 50)
        rect_pos = Point(chunk_pos.x, chunk_pos.y + half_chunk_height + 50)
        position = self._randomly_place_obj_in_rect(rect_pos, rect_size, HoneydewItemSourceBody.SIZE)
        self._build_random_food_source(world, position)

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
        flower_area = self._item_area_factory.build_new_item_area(position, size, ItemTypes.FLOWER, fertility, world.current_season)
        world.map.add_entity(flower_area)

    def _build_honeydew_item_source(self, world: World, position: Point):
        fertility = random.randint(1, 14)
        item_source = self._item_source_factory.build_new_item_source(position, ItemTypes.HONEYDEW, fertility, 10, 40, world.current_season)
        world.map.add_entity(item_source)

    def _build_nectar_item_source(self, world: World, position: Point):
        fertility = random.randint(1, 7)
        item_source = self._item_source_factory.build_new_item_source(position, ItemTypes.NECTAR, fertility, 10, 40, world.current_season)
        world.map.add_entity(item_source)

    def _build_random_food_source(self, world: World, position: Point):
        methods = [self._build_honeydew_item_source, self._build_nectar_item_source]
        return random.choice(methods)(world, position)

    def _build_tree_pack(self, world: World, tree_pos: Point):
        tree = self._tree_factory.build_new_tree(tree_pos)
        world.map.add_entity(tree)

        fertility = random.randint(1, 4)
        stick_area = self._item_area_factory.build_new_item_area(tree_pos, TreeBody.SIZE, ItemTypes.STICK, fertility, world.current_season)
        world.map.add_entity(stick_area)

        fertility = random.randint(1, 5)
        leaf_area = self._item_area_factory.build_new_item_area(tree_pos, TreeBody.SIZE, ItemTypes.LEAF, fertility, world.current_season)
        world.map.add_entity(leaf_area)

    def _check_is_point_inside_chunk(self, point: Point, chunk_pos: Point):
        is_x_inside = point.x >= chunk_pos.x and point.x <= chunk_pos.x + WorldService.CHUNK_SIZE.width
        is_y_inside = point.y >= chunk_pos.y and point.y <= chunk_pos.y + WorldService.CHUNK_SIZE.height
        return is_x_inside and is_y_inside
    
    def _calc_map_size(self, chunk_cols_count: int, chunk_rows_count: int):
        return Size(WorldService.CHUNK_SIZE.width * chunk_cols_count, WorldService.CHUNK_SIZE.height * chunk_rows_count)
