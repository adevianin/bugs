from core.world.entities.base.entity import Entity
from core.world.utils.size import Size
from core.world.utils.point import Point
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.base.live_entity.live_entity import LiveEntity
from core.world.entities.base.entity_collection import EntityCollection
from core.world.id_generator import IdGenerator
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.ant.base.ant import Ant
from core.world.entities.nest.nest import Nest
from core.world.entities.action import Action
from core.world.entities.ant.ant_factory import AntFactory
from core.world.entities.food.food_factory import FoodFactory
from core.world.entities.nest.nest_factory import NestFactory

from typing import List
import random, math
from functools import partial

class Map:

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, size: Size, entities_collection: EntityCollection, id_generator: IdGenerator, ant_factory: AntFactory, food_factory: FoodFactory, nest_factory: NestFactory):
        self._event_bus = event_bus
        self.events = events
        self._size = size
        self._entities_collection = entities_collection
        self._id_generator = id_generator
        self._ant_factory = ant_factory
        self._food_factory = food_factory
        self._nest_factory = nest_factory

        for entity in self._entities_collection.get_entities():
            self._listen_entity(entity)

    @property
    def size(self):
        return self._size
    
    def get_entity_by_id(self, id: int):
        return self._entities_collection.get_entity_by_id(id)
    
    def get_nests_from_colony(self, colony_id: int, filter: callable = None) -> List[Nest]:
        found_entities = []
        for entity in self._entities_collection.get_entities():
            if entity.type == EntityTypes.NEST and entity.from_colony == colony_id and (filter == None or filter(entity)):
                found_entities.append(entity)

        return found_entities
    
    def get_ants_from_colony(self, colony_id: int, filter: callable = None) -> List[Ant]:
        found_ants = []
        for entity in self._entities_collection.get_entities():
            if entity.type == EntityTypes.ANT and entity.from_colony == colony_id and (filter == None or filter(entity)):
                found_ants.append(entity)

        return found_ants
    
    def get_entities_by_type(self, entity_type: EntityTypes):
        found_entities = []
        for entity in self._entities_collection.get_entities():
            if entity.type == entity_type:
                found_entities.append(entity)
        return found_entities
    
    def handle_intractions(self):
        ants: List[Ant] = self.get_entities_by_type(EntityTypes.ANT)
        for ant in ants:
            entities_in_sight = self._find_entities_in_sight(ant)
            ant.mind.set_entities_in_sight(entities_in_sight)

    def _listen_entity(self, entity: Entity):
        entity.events.once('ready_to_remove', partial(self._on_entity_ready_to_remove, entity))
        entity.events.once('died', partial(self._on_entity_died, entity))
        entity.events.add_listener('action_occurred', self._on_entity_action_occured)
        entity.events.add_listener('birth_request', self._on_entity_birth_request)

    def _on_entity_ready_to_remove(self, entity: Entity):
        self._entities_collection.delete_entity(entity.id)
        entity.events.remove_all_listeners()

    def _on_entity_action_occured(self, action: Action):
        self._event_bus.emit('action_occurred', action)

    def _on_entity_birth_request(self, request: dict):
        new_entity: Entity = None
        id = self._id_generator.generate_id()
        
        match(request['entity_type']):
            case EntityTypes.ANT:
                new_entity = self._ant_factory.build_new_ant(id, request['larva'], request['nest'])
            case EntityTypes.FOOD:
                new_entity = self._food_factory.build_new_food(id, request['preborn_food'])
            case EntityTypes.NEST:
                new_entity = self._nest_factory.build_new_nest(id, request['position'], request['colony_id'])
            case _:
                raise Exception('cant birth current entity type')

        self._entities_collection.add_entity(new_entity)
        self._listen_entity(new_entity)

        new_entity.born()

        if 'callback' in request:
            request['callback'](new_entity)

        self.events.emit('entity_born', new_entity)
    
    def _on_entity_died(self, entity: Entity):
        self.events.emit('entity_died', entity)

    def _find_entities_in_sight(self, entity: LiveEntity):
        return self._find_entities_near(point=entity.position, max_distance=entity.body.sight_distance, exclude_entity_id=entity.id)

    def _find_entities_near(self, point: Point, max_distance: int, entity_types: List[EntityTypes] = None, exclude_entity_id: int = None):
        found_entities = []
        for entity in self._entities_collection.get_entities():
            dist = math.dist([entity.position.x, entity.position.y], [point.x, point.y])
            is_type_suitable = True if entity_types == None else self._check_entity_type(entity, entity_types)
            is_excluded = False if exclude_entity_id == None else exclude_entity_id == entity.id

            if (not entity.is_died and dist <= max_distance and is_type_suitable and not is_excluded):
                found_entities.append(entity)

        return found_entities
    
    def _check_entity_type(self, entity: Entity, entity_types: EntityTypes):
        for type in entity_types:
            if (entity.type == type):
                return True
            
        return False
    