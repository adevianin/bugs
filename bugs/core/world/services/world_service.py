from .base_service import BaseService
from core.world.entities.world.world_factory import WorldFactory
from core.world.entities.world.world import World
from core.world.entities.base.entity_collection import EntityCollection
from core.world.entities.map.map_factory import MapFactory
from core.world.utils.size import Size
from core.world.entities.colony.colony_factory import ColonyFactory
from core.world.entities.colony.base.colony_relations_table import ColonyRelationsTable
from core.world.settings import (LADYBUG_COLONY_ID, GENERATING_CHUNK_SIZE, HONEYDEW_ITEM_SOURCE_MAX_FERTILITY, HONEYDEW_ITEM_SOURCE_MIN_FERTILITY, NECTAR_ITEM_SOURCE_MAX_FERTILITY, 
                                 NECTAR_ITEM_SOURCE_MIN_FERTILITY, HONEYDEW_ITEM_SOURCE_MAX_ITEM_STRENGTH, NECTAR_ITEM_SOURCE_MAX_ITEM_STRENGTH, PERFORMANCE_TEST_COLONY_POPULATION,
                                 MIN_LEAF_ITEM_AREA_FERTILITY, MAX_LEAF_ITEM_AREA_FERTILITY, MIN_STICK_ITEM_AREA_FERTILITY, MAX_STICK_ITEM_AREA_FERTILITY, 
                                 MIN_FLOWER_ITEM_AREA_FERTILITY, MAX_FLOWER_ITEM_AREA_FERTILITY, SUMMER_START_YEAR_STEP)
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
from core.world.exceptions import GameError
from core.world.entities.base.entity import Entity
import random
from typing import Dict, Callable, Iterator, Tuple

class WorldService(BaseService):

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

        self._event_bus.add_listener('entity_died', self._on_entity_died)
        self._event_bus.add_listener('entity_removal_unblocked', self._on_entity_removal_unblocked)
        self._event_bus.add_listener('entity_born', self._on_entity_born)
        self._event_bus.add_listener('entity_changed_colony', self._on_entity_changed_colony)

    def _on_entity_died(self, entity: Entity):
        self._world.map.delete_entity(entity)

        if entity.from_colony_id:
            self._event_bus.emit(f'colony_entity_died:{entity.from_colony_id}', entity)
        
        if entity.type == EntityTypes.ANT:
            self._event_bus.emit('ant_died', entity)
        elif entity.type == EntityTypes.NEST:
            self._event_bus.emit('nest_died', entity)

    def _on_entity_removal_unblocked(self, entity: Entity):
        if entity.is_pending_removal:
            self._world.map.delete_entity(entity)

    def _on_entity_born(self, entity: Entity):
        self._world.map.add_entity(entity)

        if entity.from_colony_id:
            self._event_bus.emit(f'colony_entity_born:{entity.from_colony_id}', entity)
        
        if entity.type == EntityTypes.ANT:
            self._event_bus.emit('ant_born', entity)
        elif entity.type == EntityTypes.NEST:
            self._event_bus.emit('nest_born', entity)
        elif entity.type == EntityTypes.ITEM:
            self._event_bus.emit('item_born', entity)

    def _on_entity_changed_colony(self, entity: Entity, prev_colony_id):
        if prev_colony_id:
            self._event_bus.emit(f'entity_left_colony:{prev_colony_id}', entity)

        if entity.from_colony_id:
            self._event_bus.emit(f'entity_joined_colony:{entity.from_colony_id}', entity)

    def expand_current_map(self, expand_chunk_rows: int, expand_chunk_cols: int):
        if self._world.is_world_running:
            return 'world must be stopped before expanding'
        
        before_expand_chunk_rows_count = int(self._world.map.size.width / GENERATING_CHUNK_SIZE.width)
        before_expand_chunk_cols_count = int(self._world.map.size.height / GENERATING_CHUNK_SIZE.height)
        before_expand_last_row_index = before_expand_chunk_rows_count - 1
        before_expand_last_col_index = before_expand_chunk_cols_count - 1
        after_expand_chunk_rows_count = before_expand_chunk_rows_count + expand_chunk_rows
        after_expand_chunk_cols_count = before_expand_chunk_cols_count + expand_chunk_cols

        self._world.map.size = self._calc_map_size(after_expand_chunk_cols_count, after_expand_chunk_rows_count)

        for chunk_position, indexes, edge_info in self._chunks_positions(before_expand_chunk_rows_count, before_expand_chunk_cols_count):
            if edge_info['is_right_edge'] or edge_info['is_bottom_edge']:
                self._clear_flower_item_area_in_chunk(chunk_position, self._world)
                self._generate_chunk(chunk_position, self._world, edge_info)

        for chunk_position, indexes, edge_info in self._chunks_positions(after_expand_chunk_rows_count, after_expand_chunk_cols_count):
            if indexes['row_index'] > before_expand_last_row_index or indexes['col_index'] > before_expand_last_col_index:
                self._generate_chunk(chunk_position, self._world, edge_info)

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
                                                SUMMER_START_YEAR_STEP - 5, notifications, last_used_id)
        
        return world

    def populate_empty_world(self, world: World):
        chunk_rows_count = int(world.map.size.width / GENERATING_CHUNK_SIZE.width)
        chunk_cols_count = int(world.map.size.height / GENERATING_CHUNK_SIZE.height)
        
        for chunk_position, indexes, edge_info in self._chunks_positions(chunk_rows_count, chunk_cols_count):
            self._generate_chunk(chunk_position, world, edge_info)

        return world
    
    def count_ants(self):
        return len(self._world.map.get_entities(entity_types=[EntityTypes.ANT]))
    
    def populate_world_for_performance_testing(self, owner_id: int):
        from core.world.entities.ant.queen.queen_ant import QueenAnt
        from core.world.entities.nest.nest import Nest
        from core.world.entities.ant.base.ant_types import AntTypes
        from core.world.entities.ant.base.genetic.genes.development_warrior_caste_gene import DevelopmentWarriorCasteGene
        from core.world.settings import SUMMER_START_YEAR_STEP
        item_sources = self._world.map.get_entities(entity_types=[EntityTypes.ITEM_SOURCE])
        nupt_env = self._find_nuptial_environment_for_owner(owner_id)
        colony_positions = []
        for item_source in item_sources:
            colony_positions.append(Point(item_source.position.x, item_source.position.y + 150))
            colony_positions.append(Point(item_source.position.x - 150, item_source.position.y))
            colony_positions.append(Point(item_source.position.x + 150, item_source.position.y))

        colony_index = 0
        for colony_position in colony_positions:
            colony_index += 1
            def on_antara_born(antara: QueenAnt):
                if len(nupt_env.males) == 0:
                    nupt_env.start_nuptial_season()
                male_id = nupt_env.males[0].id
                male = nupt_env.pull_male(male_id)
                male.genome.maternal_chromosomes_set.inject_gene(DevelopmentWarriorCasteGene.build_new_for_specie_gene())
                antara.fertilize(male)

                new_colony = self._colony_factory.build_new_ant_colony(owner_id, self._world.map, self._world.colony_relations_table, f'colony_{colony_index}')
                self._world.add_new_colony(new_colony)

                antara.from_colony_id = new_colony.id

                def on_nest_found(nest: Nest):
                    antara.relocate_to_nest(nest)
                    antara.fly_nuptial_flight_back(nest.position)
                    # for i in range():
                    #     nest.build()
                    nest.take_calories(99999999999)
                    for i in range(PERFORMANCE_TEST_COLONY_POPULATION):
                        egg = antara.produce_egg(f'ant_{i}', True)
                        egg.ant_type = random.choice([AntTypes.WORKER, AntTypes.WARRIOR])
                        egg._progress = 100
                        nest.add_egg(egg)
                        nest.move_egg_to_larva_chamber(egg.id)
                    for larva in nest.larvae:
                        larva.feed(larva.required_food - 1)

                antara.found_nest(f'nest_{colony_index}', True, colony_position, on_nest_found)
            
            nupt_env.born_antara(Point(100, 100), on_antara_born)

            self._world._current_step = SUMMER_START_YEAR_STEP - 2
            self._world.climate._current_temp = 5

    def _chunks_positions(self, chunk_rows_count: int, chunk_cols_count: int) -> Iterator[Tuple[Point, Dict, Dict]]:
        for chunk_col_index in range(chunk_cols_count):
            for chunk_row_index in range(chunk_rows_count):
                chunk_position = Point(chunk_col_index * GENERATING_CHUNK_SIZE.width, chunk_row_index * GENERATING_CHUNK_SIZE.height)
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
        half_chunk_width = int(GENERATING_CHUNK_SIZE.width / 2)
        half_chunk_height = int(GENERATING_CHUNK_SIZE.height / 2)

        position = Point(chunk_pos.x + half_chunk_width, chunk_pos.y + half_chunk_height)
        size = Size(GENERATING_CHUNK_SIZE.width - 10, GENERATING_CHUNK_SIZE.height - 10)
        self._build_flower_item_area(world, position, size)

    def _generate_chunk_type_1(self, chunk_pos: Point, world: World, edge_info: Dict):
        half_chunk_width = int(GENERATING_CHUNK_SIZE.width / 2)
        half_chunk_height = int(GENERATING_CHUNK_SIZE.height / 2)
        honeydew_count = random.randint(1, 2)

        rect_size = Size(half_chunk_width, GENERATING_CHUNK_SIZE.height)
        position = self._randomly_place_obj_in_rect(chunk_pos, rect_size, HoneydewItemSourceBody.SIZE)
        self._build_random_food_source(world, position)

        if honeydew_count > 1:
            rect_size = Size(half_chunk_width, GENERATING_CHUNK_SIZE.height)
            rect_pos = Point(chunk_pos.x + half_chunk_width, chunk_pos.y)
            position = self._randomly_place_obj_in_rect(rect_pos, rect_size, HoneydewItemSourceBody.SIZE)
            self._build_random_food_source(world, position)

        position = Point(chunk_pos.x + half_chunk_width, chunk_pos.y + half_chunk_height)
        size = Size(GENERATING_CHUNK_SIZE.width - 10, GENERATING_CHUNK_SIZE.height - 10)
        self._build_flower_item_area(world, position, size)

    def _generate_chunk_type_2(self, chunk_pos: Point, world: World, edge_info: Dict): 
        half_chunk_width = int(GENERATING_CHUNK_SIZE.width / 2)
        half_chunk_height = int(GENERATING_CHUNK_SIZE.height / 2)
        is_mirror = random.choice([True, False])
        mirror_x = chunk_pos.x + half_chunk_width

        rect_size = Size(half_chunk_width, GENERATING_CHUNK_SIZE.height)
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
        half_chunk_height = int(GENERATING_CHUNK_SIZE.height / 2)

        rect_size = Size(GENERATING_CHUNK_SIZE.width, half_chunk_height + 50)
        tree_pos = self._randomly_place_obj_in_rect(chunk_pos, rect_size, TreeBody.SIZE)
        self._build_tree_pack(world, tree_pos)

        rect_size = Size(GENERATING_CHUNK_SIZE.width, half_chunk_height - 50)
        rect_pos = Point(chunk_pos.x, chunk_pos.y + half_chunk_height + 50)
        position = self._randomly_place_obj_in_rect(rect_pos, rect_size, HoneydewItemSourceBody.SIZE)
        self._build_random_food_source(world, position)

    def _randomly_place_obj_in_rect(self, rect_pos: Point, rect_size: Size, obj_size: Size, padding: int = 10):
        if obj_size.width + 2 * padding > rect_size.width or obj_size.height + 2 * padding > rect_size.height:
            raise GameError('not corect rect size or obj size')
        min_x = rect_pos.x + int(obj_size.width / 2) + padding
        max_x = rect_pos.x + int(rect_size.width - obj_size.width / 2) - padding
        min_y = rect_pos.y + obj_size.height + padding
        max_y = rect_pos.y + rect_size.height - padding
        return Point(random.randint(min_x, max_x), random.randint(min_y, max_y))
    
    def _build_flower_item_area(self, world: World, position: Point, size: Size):
        fertility = random.randint(MIN_FLOWER_ITEM_AREA_FERTILITY, MAX_FLOWER_ITEM_AREA_FERTILITY)
        flower_area = self._item_area_factory.build_new_item_area(position, size, ItemTypes.FLOWER, fertility, world.current_season)
        world.map.add_entity(flower_area)

    def _build_honeydew_item_source(self, world: World, position: Point):
        fertility = random.randint(HONEYDEW_ITEM_SOURCE_MIN_FERTILITY, HONEYDEW_ITEM_SOURCE_MAX_FERTILITY)
        max_item_strength = HONEYDEW_ITEM_SOURCE_MAX_ITEM_STRENGTH
        item_source = self._item_source_factory.build_new_item_source(position, ItemTypes.HONEYDEW, fertility, max_item_strength, world.current_season)
        world.map.add_entity(item_source)

    def _build_nectar_item_source(self, world: World, position: Point):
        fertility = random.randint(NECTAR_ITEM_SOURCE_MIN_FERTILITY, NECTAR_ITEM_SOURCE_MAX_FERTILITY)
        max_item_strength = NECTAR_ITEM_SOURCE_MAX_ITEM_STRENGTH
        item_source = self._item_source_factory.build_new_item_source(position, ItemTypes.NECTAR, fertility, max_item_strength, world.current_season)
        world.map.add_entity(item_source)

    def _build_random_food_source(self, world: World, position: Point):
        methods = [self._build_honeydew_item_source, self._build_nectar_item_source]
        return random.choice(methods)(world, position)

    def _build_tree_pack(self, world: World, tree_pos: Point):
        tree = self._tree_factory.build_new_tree(tree_pos)
        world.map.add_entity(tree)

        fertility = random.randint(MIN_STICK_ITEM_AREA_FERTILITY, MAX_STICK_ITEM_AREA_FERTILITY)
        stick_area = self._item_area_factory.build_new_item_area(tree_pos, TreeBody.SIZE, ItemTypes.STICK, fertility, world.current_season)
        world.map.add_entity(stick_area)

        fertility = random.randint(MIN_LEAF_ITEM_AREA_FERTILITY, MAX_LEAF_ITEM_AREA_FERTILITY)
        leaf_area = self._item_area_factory.build_new_item_area(tree_pos, TreeBody.SIZE, ItemTypes.LEAF, fertility, world.current_season)
        world.map.add_entity(leaf_area)

    def _check_is_point_inside_chunk(self, point: Point, chunk_pos: Point):
        is_x_inside = point.x >= chunk_pos.x and point.x <= chunk_pos.x + GENERATING_CHUNK_SIZE.width
        is_y_inside = point.y >= chunk_pos.y and point.y <= chunk_pos.y + GENERATING_CHUNK_SIZE.height
        return is_x_inside and is_y_inside
    
    def _calc_map_size(self, chunk_cols_count: int, chunk_rows_count: int):
        return Size(GENERATING_CHUNK_SIZE.width * chunk_cols_count, GENERATING_CHUNK_SIZE.height * chunk_rows_count)
