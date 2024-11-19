from core.world.entities.base.entity import Entity
from core.world.utils.size import Size
from core.world.utils.point import Point
from core.world.entities.base.entity_types import EntityTypes, EntityTypesPack
from core.world.entities.base.live_entity.live_entity import LiveEntity
from core.world.entities.base.entity_collection import EntityCollection
from core.world.utils.event_emiter import EventEmitter

from typing import List, Callable
import random, math

class Map:

    def __init__(self, event_bus: EventEmitter, size: Size, entities_collection: EntityCollection):
        self._event_bus = event_bus
        self._size = size
        self._entities_collection = entities_collection

        self._event_bus.add_listener('entity_died', self._on_entity_died)
        self._event_bus.add_listener('entity_removal_unblocked', self._on_entity_removal_unblocked)
        self._event_bus.add_listener('entity_born', self._on_entity_born)

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
    
    def add_entity(self, entity: Entity):
        self._entities_collection.add_entity(entity)
    
    def get_entity_by_id(self, id: int) -> Entity:
        return self._entities_collection.get_entity_by_id(id)
    
    def get_all_entities(self) -> List[Entity]:
        return self._entities_collection.get_entities()
    
    def get_entities(self, from_colony_id: int = None, entity_types: List[EntityTypes] = None, filter: Callable[[Entity], bool] = None) -> List[Entity]:
        found_entities = []
        for entity in self._entities_collection.get_entities():
            is_colony_suitable = not from_colony_id or entity.from_colony_id == from_colony_id
            if not is_colony_suitable:
                continue

            is_type_suitable = not entity_types or entity.type in entity_types
            if not is_type_suitable:
                continue

            is_filter_passed = not filter or filter(entity)
            if not is_filter_passed:
                continue

            if entity.is_pending_removal:
                continue

            found_entities.append(entity)
        return found_entities
    
    def find_entities_near(self, point: Point, max_distance: int, entity_types: List[EntityTypes] = None, filter: Callable[[Entity], bool] = None) -> List[Entity]:
        found_entities = []
        for entity in self._entities_collection.get_entities():
            dist = math.dist([entity.body.position.x, entity.body.position.y], [point.x, point.y])
            is_type_suitable = not entity_types or entity.type in entity_types
            if not is_type_suitable:
                continue

            is_dist_suitable = dist <= max_distance
            if not is_dist_suitable:
                continue

            is_filter_suitable = not filter or filter(entity)
            if not is_filter_suitable:
                continue

            if entity.is_pending_removal:
                continue

            found_entities.append(entity)

        return found_entities
    
    def get_live_entities(self) -> List[LiveEntity]:
        return self.get_entities(entity_types=EntityTypesPack.LIVE_ENTITIES)
    
    def get_not_live_entities(self) -> List[Entity]:
        not_live_filter: Callable[[Entity], bool] = lambda entity: entity.type not in EntityTypesPack.LIVE_ENTITIES
        return self.get_entities(filter=not_live_filter)
    
    def _on_entity_died(self, entity: Entity):
        if not entity.is_removal_blocked:
            self._entities_collection.delete_entity(entity.id)

    def _on_entity_removal_unblocked(self, entity: Entity):
        if entity.is_pending_removal:
            self._entities_collection.delete_entity(entity.id)

    def _on_entity_born(self, entity: Entity):
        self._entities_collection.add_entity(entity)
