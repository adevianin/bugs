from core.world.entities.map.map import Map
from core.world.id_generator import IdGenerator
from core.world.entities.base.entity import Entity
from core.world.utils.event_emiter import EventEmitter
from .requests.birth_request import BirthRequest
from core.world.entities.base.entity_types import EntityTypes
from abc import ABC, abstractmethod

class EntityBirther(ABC):

    def __init__(self, event_bus: EventEmitter, entity_type: EntityTypes, id_generator: IdGenerator, map: Map):
        self._event_bus = event_bus
        self._id_generator = id_generator
        self._map = map
        self._entity_type = entity_type

        self._map.events.add_listener('entity_born', lambda entity: self._listen_entity(entity))
        self._event_bus.add_listener('birth_request', self._on_entity_birth_request)

        for entity in self._map.get_entities():
            self._listen_entity(entity)

    def _listen_entity(self, entity: Entity):
        entity.events.add_listener('birth_request', self._on_entity_birth_request)

    def _on_entity_birth_request(self, request: BirthRequest):
        if self._entity_type == request.entity_type:
            self._handle_request(request)

    def _handle_request(self, request: BirthRequest):
        id = self._id_generator.generate_id()
        
        new_entity: Entity = self._build_entity(id, request)

        if request.preborn_callback:
            request.preborn_callback(new_entity)
            
        self._map.add_new_entity(new_entity)

        if request.callback:
            request.callback(new_entity)

    @abstractmethod
    def _build_entity(self, id, request: BirthRequest) -> Entity:
        pass