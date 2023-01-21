from abc import ABC, abstractmethod
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from ..entity_types import EntityTypes

class Entity(ABC):

    def __init__(self, event_bus: EventEmitter, id: int, type: EntityTypes):
        self._event_bus: EventEmitter = event_bus
        self._id: int = id
        self._type: EntityTypes = type

    @property
    def id(self):
        return self._id

    @id.setter
    def id(self, id: int):
        self.id = id

    @property
    def type(self):
        return self._type

    @property
    @abstractmethod
    def position(self):
        pass

    @position.setter
    @abstractmethod
    def position(self, value: Point):
        pass

    @abstractmethod
    def do_step(self):
        pass

    def to_json(self):
        return {
            'id': self.id,
            'type': self._type,
        }

    def emit_change(self):
        self._event_bus.emit('entity_changed', self)

    