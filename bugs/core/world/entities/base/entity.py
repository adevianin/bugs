from abc import ABC, abstractmethod
from core.world.utils.event_emiter import EventEmitter
from .entity_types import EntityTypes
from core.world.entities.base.body import Body
from core.world.utils.point import Point
from core.world.entities.action.action import Action, ActionTypes
class Entity(ABC):

    _body: Body

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, type: EntityTypes, from_colony_id: int, body: Body):
        self._event_bus = event_bus
        self.events = events
        self._id: int = id
        self._type: EntityTypes = type
        self._from_colony_id = from_colony_id
        self._body = body

        self.events.add_listener('body_action', self._emit_action)

    @property
    def id(self):
        return self._id

    @property
    def type(self):
        return self._type
    
    @property
    def from_colony_id(self):
        return self._from_colony_id
    
    @from_colony_id.setter
    def from_colony_id(self, colony_id: int):
        self._from_colony_id = colony_id
        self._emit_action(ActionTypes.ENTITY_COLONY_CHANGED, { 'colony_id': colony_id })

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
        self._emit_action(ActionTypes.ENTITY_BORN, { 'entity': self })

    def die(self):
        self._body.hp = 0

    @abstractmethod
    def do_step(self):
        pass

    def _emit_action(self, action_type: ActionTypes, action_data: dict = None):
        self._event_bus.emit('action', Action.build_entity_action(self.id, action_type, action_data))
    