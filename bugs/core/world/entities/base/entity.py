from abc import ABC, abstractmethod
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from .entity_types import EntityTypes

class Entity(ABC):

    def __init__(self, event_bus: EventEmitter, id: int, type: EntityTypes):
        self._event_bus: EventEmitter = event_bus
        self._id: int = id
        self._type: EntityTypes = type
        self._is_hidden = False

    @property
    def id(self):
        return self._id

    @id.setter
    def id(self, id: int):
        self._id = id

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

    @property
    def is_hidden(self):
        return self._is_hidden

    def toggle_hidden(self, is_hidden: bool):
        self._is_hidden = is_hidden

    def die(self):
        self.toggle_hidden(True)
        self._event_bus.emit('entity_died', self)
        self.handle_action('entity_died')

    @abstractmethod
    def do_step(self):
        pass

    def to_json(self):
        return {
            'id': self.id,
            'type': self._type,
        }
    
    def handle_action(self, action_type: str, action_data: dict = None):
        self._event_bus.emit('step_action_occurred', self.id, action_type, action_data)
