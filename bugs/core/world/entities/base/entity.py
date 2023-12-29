from abc import ABC, abstractmethod
from core.world.utils.event_emiter import EventEmitter
from .entity_types import EntityTypes
from core.world.entities.action import Action
from core.world.entities.base.body import Body
from core.world.utils.point import Point

class Entity(ABC):

    _body: Body

    def __init__(self, events: EventEmitter, id: int, type: EntityTypes, from_colony_id: int, body: Body):
        self.events = events
        self._id: int = id
        self._type: EntityTypes = type
        self._from_colony_id = from_colony_id
        self._body = body

    @property
    def id(self):
        return self._id

    @property
    def type(self):
        return self._type
    
    @property
    def from_colony_id(self):
        return self._from_colony_id

    @property
    def body(self) -> Body:
        return self._body
    
    @property
    def position(self) -> Point:
        return self._body.position
    
    @property
    def is_died(self):
        return self._body.is_died
    
    def born(self):
        self.events.emit('action', 'entity_born', { 'entity': self.to_public_json() })

    def die(self):
        self._body.hp = 0

    @abstractmethod
    def do_step(self):
        pass

    def to_public_json(self):
        return {
            'id': self.id,
            'type': self._type,
            'from_colony_id': self._from_colony_id,
            'hp': self._body.hp,
            'max_hp': self._body.stats.max_hp,
            'position': self._body.position.to_public_json(),
            'angle': self._body.angle,
            'size': self._body.SIZE.to_public_json()
        }
    