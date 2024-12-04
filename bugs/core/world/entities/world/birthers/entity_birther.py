from core.world.entities.map.map import Map
from core.world.entities.base.entity import Entity
from core.world.utils.event_emiter import EventEmitter
from .requests.birth_request import BirthRequest
from abc import ABC, abstractmethod
from core.world.entities.action.entity_born_action import EntityBornAction

class EntityBirther(ABC):

    def __init__(self, event_bus: EventEmitter, request_event_name: str, map: Map):
        self._event_bus = event_bus
        self._map = map

        self._event_bus.add_listener(request_event_name, self._handle_request)

    def _handle_request(self, request: BirthRequest):
        new_entity: Entity = self._build_entity(request)

        if request.preborn_callback:
            request.preborn_callback(new_entity)
            
        self._event_bus.emit('action', EntityBornAction.build(new_entity))
        self._event_bus.emit('entity_born', new_entity)

        if request.callback:
            request.callback(new_entity)

    @abstractmethod
    def _build_entity(self, request: BirthRequest) -> Entity:
        pass