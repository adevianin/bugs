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
        self._event_bus.add_listener('entity_born', self._on_entity_born)

        self._set_up_world_interactors()

    @property
    def size(self):
        return self._size
    
    def generate_random_point(self):
        return Point(200, 100)
        x = random.randint(0, self._size.width)
        y = random.randint(0, self._size.height)
        return Point(x, y)
    
    def get_entity_by_id(self, id: int) -> Entity:
        return self._entities_collection.get_entity_by_id(id)
    
    def get_all_entities(self) -> List[Entity]:
        return self._entities_collection.get_entities()
    
    def get_entities(self, from_colony_id: int = None, entity_types: List[EntityTypes] = None, filter: Callable[[Entity], bool] = None) -> List[Entity]:
        found_entities = []
        for entity in self._entities_collection.get_entities():
            if (not from_colony_id or entity.from_colony_id == from_colony_id) and (not entity_types or entity.type in entity_types) and (not filter or filter(entity)):
                found_entities.append(entity)
        return found_entities
    
    def find_entities_near(self, point: Point, max_distance: int, entity_types: List[EntityTypes] = None, filter: Callable[[Entity], bool] = None) -> List[Entity]:
        found_entities = []
        for entity in self._entities_collection.get_entities():
            dist = math.dist([entity.body.position.x, entity.body.position.y], [point.x, point.y])
            is_type_suitable = not entity_types or entity.type in entity_types

            if (not entity.body.is_died and dist <= max_distance and is_type_suitable and (not filter or filter(entity))):
                found_entities.append(entity)

        return found_entities
    
    def handle_intractions(self):
        live_entities: List[LiveEntity] = self.get_entities(entity_types=EntityTypesPack.LIVE_ENTITIES)
        for live_entity in live_entities:
            entities_in_sight = self._find_entities_in_sight(live_entity)
            live_entity.body.world_interactor.set_nearby_entities(entities_in_sight)

    def _set_up_world_interactors(self):
        live_entities: List[LiveEntity] = self.get_entities(entity_types=EntityTypesPack.LIVE_ENTITIES)
        for live_entity in live_entities:
            self._set_up_world_interactor_for_entity(live_entity)

    def _set_up_world_interactor_for_entity(self, entity: LiveEntity):
        entity.body.world_interactor.set_map_size(self._size)

    def _on_entity_died(self, entity: Entity):
        self._entities_collection.delete_entity(entity.id)

    def _on_entity_born(self, entity: Entity):
        if (entity.type in EntityTypesPack.LIVE_ENTITIES):
            self._set_up_world_interactor_for_entity(entity)
        self._entities_collection.add_entity(entity)

    def _find_entities_in_sight(self, entity: LiveEntity):
        return self.find_entities_near(point=entity.position, max_distance=entity.body.stats.sight_distance, filter=lambda checking_entity: entity.id != checking_entity.id)
