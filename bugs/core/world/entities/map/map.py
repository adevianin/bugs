from core.world.entities.base.entity import Entity
from core.world.utils.size import Size
from core.world.utils.point import Point
from core.world.entities.base.entity_types import EntityTypes, EntityTypesPack
from core.world.entities.base.live_entity.live_entity import LiveEntity
from core.world.entities.base.entity_collection import EntityCollection
from core.world.utils.event_emiter import EventEmitter
from core.world.settings import MAP_CHUNK_SIZE
from .chunk import Chunk
from typing import List, Callable
from core.world.exceptions import GameError
from core.world.utils.rectangle import Rectangle
import random, math
from core.world.entities.base.live_entity.vision_stream_interface import iVisionStream

class Map(iVisionStream):

    def __init__(self, event_bus: EventEmitter, size: Size, entities_collection: EntityCollection):
        self._event_bus = event_bus
        self._size = size
        self._entities_collection = entities_collection
        self._chunks: List[Chunk] = []

        self._split_on_chunks()
        self._add_all_entities_to_chunks()

        self._event_bus.add_listener('entity_died', self._on_entity_died)
        self._event_bus.add_listener('entity_removal_unblocked', self._on_entity_removal_unblocked)
        self._event_bus.add_listener('entity_born', self._on_entity_born)
        self._event_bus.add_listener('entity_moved', self._on_entity_moved)

    @property
    def size(self):
        return self._size
    
    @size.setter
    def size(self, size: Size):
        self._size = size
    
    def generate_random_point(self, padding: int = 10):
        x = random.randint(padding, self._size.width - padding)
        y = random.randint(padding, self._size.height - padding)
        return Point(x, y)
    
    def generate_random_point_within_circle(self, center: Point, radius: int, min_distance_to_center: int, map_padding: int = 10):
        radius = radius - 2
        point = Point.generate_random_point_within_circle(center, radius, min_distance_to_center)
        x = point.x 
        y = point.y
        if x > self._size.width:
            x = self._size.width - map_padding
        elif x < 0:
            x = 0 + map_padding

        if y > self._size.height:
            y = self._size.height - map_padding
        elif y < 0:
            y = 0 + map_padding  

        return Point(x, y)
    
    def has_entity(self, id: int) -> bool:
        return self._entities_collection.has_entity(id)
    
    def add_entity(self, entity: Entity):
        self._entities_collection.add_entity(entity)
    
    def get_entity_by_id(self, id: int) -> Entity:
        return self._entities_collection.get_entity_by_id(id)
    
    def find_entity_by_id(self, id: int) -> Entity:
        if self._entities_collection.has_entity(id):
            return self.get_entity_by_id(id)
        else:
            return None
    
    def get_all_entities(self) -> List[Entity]:
        return self._entities_collection.get_entities()
    
    def get_entities(self, from_colony_id: int = None, entity_types: List[EntityTypes] = None, filter: Callable[[Entity], bool] = None) -> List[Entity]:
        found_entities = []
        for entity in self._entities_collection.get_entities():
            if entity.is_pending_removal:
                continue

            is_colony_suitable = not from_colony_id or entity.from_colony_id == from_colony_id
            if not is_colony_suitable:
                continue

            is_type_suitable = not entity_types or entity.type in entity_types
            if not is_type_suitable:
                continue

            is_filter_passed = not filter or filter(entity)
            if not is_filter_passed:
                continue

            found_entities.append(entity)
        return found_entities
    
    def find_entities_near(self, point: Point, max_distance: int, entity_types: List[EntityTypes] = None, filter: Callable[[Entity], bool] = None, is_detectable_only: bool = True) -> List[Entity]:
        if entity_types is not None and not isinstance(entity_types, list):
            raise GameError('entity_types must be a list')
        
        chunks = self._get_chunks_in_area(point, max_distance)
        entities: List[Entity] = []
        for chunk in chunks:
            entities += chunk.entities

        found_entities = []
        for entity in entities:
            if entity.is_pending_removal:
                continue

            if is_detectable_only and not entity.is_detectable:
                continue
            
            is_type_suitable = not entity_types or entity.type in entity_types
            if not is_type_suitable:
                continue
            
            dist = math.dist([entity.body.position.x, entity.body.position.y], [point.x, point.y])
            is_dist_suitable = dist <= max_distance
            if not is_dist_suitable:
                continue

            is_filter_suitable = not filter or filter(entity)
            if not is_filter_suitable:
                continue

            found_entities.append(entity)

        return found_entities
    
    def get_live_entities(self) -> List[LiveEntity]:
        return self.get_entities(entity_types=EntityTypesPack.LIVE_ENTITIES)
    
    def get_not_live_entities(self) -> List[Entity]:
        not_live_filter: Callable[[Entity], bool] = lambda entity: entity.type not in EntityTypesPack.LIVE_ENTITIES
        return self.get_entities(filter=not_live_filter)
    
    def _get_chunks_in_area(self, point: Point, radius: int) -> List[Chunk]:
        area_rect = Rectangle.build(point.x - radius, point.y - radius, 2*radius, 2*radius)
        res = []

        for chunk in self._chunks:
            if chunk.intersects(area_rect):
                res.append(chunk)

        return res
    
    def _split_on_chunks(self):
        rows_count = math.ceil(self._size.height / MAP_CHUNK_SIZE.height)
        cols_count = math.ceil(self._size.width / MAP_CHUNK_SIZE.width)
        for chunk_col_index in range(cols_count):
            for chunk_row_index in range(rows_count):
                chunk_position = Point(chunk_col_index * MAP_CHUNK_SIZE.width, chunk_row_index * MAP_CHUNK_SIZE.height)
                chunk = Chunk.build(chunk_position)
                self._chunks.append(chunk)
    
    def _add_all_entities_to_chunks(self):
        for entity in self._entities_collection.get_entities():
            self._add_entity_to_chunks(entity)

    def _add_entity_to_chunks(self, entity: Entity):
        for chunk in self._chunks:
            if chunk.contains_point(entity.position):
                chunk.add_entity(entity)
                return
        
        raise GameError('cant find suitable chunk')
    
    def _remove_entity_from_chunks(self, entity: Entity):
        for chunk in self._chunks:
            if chunk.contains_entity(entity):
                chunk.remove_entity(entity)
                return
    
    def _on_entity_died(self, entity: Entity):
        if not entity.is_removal_blocked:
            self._entities_collection.delete_entity(entity.id)
            self._remove_entity_from_chunks(entity)

    def _on_entity_removal_unblocked(self, entity: Entity):
        if entity.is_pending_removal:
            self._entities_collection.delete_entity(entity.id)
            self._remove_entity_from_chunks(entity)

    def _on_entity_born(self, entity: Entity):
        self._entities_collection.add_entity(entity)
        self._add_entity_to_chunks(entity)

    def _on_entity_moved(self, entity: Entity):
        for chunk in self._chunks:
            if chunk.contains_entity(entity):
                if not chunk.contains_point(entity.position):
                    chunk.remove_entity(entity)
                    self._add_entity_to_chunks(entity)
                return
            
        raise GameError('cant find entity containing chunk')
