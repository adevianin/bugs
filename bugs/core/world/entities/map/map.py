from core.world.entities.base.entity import Entity
from core.world.utils.size import Size
from core.world.utils.point import Point
from core.world.entities.base.entity_types import EntityTypes, EntityTypesPack
from core.world.entities.base.live_entity.live_entity import LiveEntity
from core.world.entities.base.entity_collection import EntityCollection
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.action.entity_born_action import EntityBornAction

from typing import List, Callable
import random, math
from functools import partial

class Map:

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, size: Size, entities_collection: EntityCollection):
        self._event_bus = event_bus
        self.events = events
        self._size = size
        self._entities_collection = entities_collection

        for entity in self._entities_collection.get_entities():
            self._handle_entity(entity)

    @property
    def size(self):
        return self._size
    
    def generate_random_point(self):
        return Point(200, 100)
        x = random.randint(0, self._size.width)
        y = random.randint(0, self._size.height)
        return Point(x, y)
    
    def add_new_entity(self, new_entity: Entity):
        self._entities_collection.add_entity(new_entity)
        self._handle_entity(new_entity)
        self._event_bus.emit('action', EntityBornAction.build(new_entity))
        self.events.emit('entity_born', new_entity)
    
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

    def _handle_entity(self, entity: Entity):
        entity.events.once('ready_to_remove', partial(self._on_entity_ready_to_remove, entity))
        entity.events.once('died', partial(self._on_entity_died, entity))
        # entity.events.add_listener('action', partial(self._on_entity_action_occured, entity))

        if (entity.type in EntityTypesPack.LIVE_ENTITIES):
            entity: LiveEntity = entity
            entity.body.world_interactor.set_map_size(self._size)

    def _on_entity_ready_to_remove(self, entity: Entity):
        self._entities_collection.delete_entity(entity.id)
        entity.events.remove_all_listeners()

    # def _on_entity_action_occured(self, entity: Entity, action_type: str, action_data: dict = None):
    #     self._event_bus.emit('action_occurred', Action.build_action(entity.id, action_type, 'entity', action_data))

    def _on_entity_died(self, entity: Entity):
        self.events.emit('entity_died', entity)

    def _find_entities_in_sight(self, entity: LiveEntity):
        return self.find_entities_near(point=entity.position, max_distance=entity.body.stats.sight_distance, filter=lambda checking_entity: entity.id != checking_entity.id)
