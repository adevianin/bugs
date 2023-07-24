from abc import ABC, abstractmethod
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from .entity_types import EntityTypes
from core.world.entities.action import Action

class Entity(ABC):

    def __init__(self, events: EventEmitter, id: int, type: EntityTypes, from_colony: int):
        self.events = events
        self._id: int = id
        self._type: EntityTypes = type
        self._from_colony = from_colony

    @property
    def id(self):
        return self._id

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
    
    def damage(self, damage: int):
        if not self.is_died:
            self.hp -= damage if self.hp > damage else self.hp
        return self.is_died

    def born(self):
        self._emit_action('entity_born', { 'entity': self.to_public_json() })

    def die(self):
        self.hp = 0

    @abstractmethod
    def do_step(self):
        pass

    def to_public_json(self):
        return {
            'id': self.id,
            'type': self._type,
            'from_colony': self._from_colony
        }
    
    def _emit_action(self, action_type: str, action_data: dict = None):
        self.events.emit('action_occurred', Action.build_action(self.id, action_type, action_data))

    def _handle_dieing(self):
        self._emit_action('entity_died')
        self.events.emit('died')
        self.events.emit('ready_to_remove')
