from abc import ABC, abstractmethod
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from .entity_types import EntityTypes
from core.world.entities.action import Action

class Entity(ABC):

    def __init__(self, event_bus: EventEmitter, id: int, type: EntityTypes, from_colony: int):
        self._event_bus: EventEmitter = event_bus
        self._id: int = id
        self._type: EntityTypes = type
        self._is_hidden = False
        self._from_colony = from_colony

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
    
    @property
    def is_died(self):
        return self.hp == 0
    
    @property
    @abstractmethod
    def hp(self):
        pass

    @hp.setter
    @abstractmethod
    def hp(self, value: int):
        pass
    
    @property
    def from_colony(self):
        return self._from_colony

    def toggle_hidden(self, is_hidden: bool):
        self._is_hidden = is_hidden

    @abstractmethod
    def do_step(self):
        pass

    def to_public_json(self):
        return {
            'id': self.id,
            'type': self._type,
            'from_colony': self._from_colony
        }
    
    def handle_action(self, action_type: str, action_data: dict = None):
        self._event_bus.emit('action_occurred', Action.build_action(self.id, action_type, action_data))

    def born(self):
        self.handle_action('entity_born', { 'entity': self.to_public_json() })

    def die(self):
        self.hp = 0

    def _handle_dieing(self):
        self.toggle_hidden(True)
        self._event_bus.emit('entity_died', self)
        self.handle_action('entity_died')

    
