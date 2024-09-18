from abc import ABC, abstractmethod
from core.world.utils.event_emiter import EventEmitter
from .entity_types import EntityTypes
from core.world.entities.base.body import Body
from core.world.utils.point import Point
from core.world.entities.action.base.action import Action
from core.world.entities.action.entity_died_action import EntityDiedAction
from core.world.entities.action.entity_rotated_action import EntityRotatedAction
from core.world.entities.action.entity_hp_changed_action import EntityHpChangedAction
from core.world.entities.action.entity_colony_changed_action import EntityColonyChangedAction

class Entity(ABC):

    _body: Body

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, type: EntityTypes, from_colony_id: int, owner_id: int, body: Body):
        self._event_bus = event_bus
        self._events = events
        self._id: int = id
        self._type: EntityTypes = type
        self._from_colony_id = from_colony_id
        self._owner_id = owner_id
        self._body = body

        self._body.events.add_listener('died', self._on_died)
        self._body.events.add_listener('angle_changed', self._on_angle_changed)
        self._body.events.add_listener('hp_changed', self._on_hp_changed)

    @property
    def id(self):
        return self._id
    
    @property
    def events(self):
        return self._events

    @property
    def type(self):
        return self._type
    
    @property
    def from_colony_id(self):
        return self._from_colony_id
    
    @from_colony_id.setter
    def from_colony_id(self, colony_id: int):
        self._from_colony_id = colony_id
        self._emit_action(EntityColonyChangedAction.build(self.id, colony_id))

    @property
    def owner_id(self):
        return self._owner_id

    @property
    def body(self) -> Body:
        return self._body
    
    @property
    def position(self) -> Point:
        return self._body.position
    
    @position.setter
    def position(self, value):
        self._body.position = value
    
    @property
    def is_died(self):
        return self._body.is_died
    
    @property
    def stats(self):
        return self._body.stats

    @property
    def is_detectable(self):
        return True
    
    def die(self):
        self._body.hp = 0

    @abstractmethod
    def do_step(self):
        pass

    def _on_died(self):
        self._emit_action(EntityDiedAction.build(self.id))
        self.events.emit('died')
        # self.events.remove_all_listeners()
        self._event_bus.emit('entity_died', self)

    def _on_angle_changed(self):
        self._emit_action(EntityRotatedAction.build(self.id, self._body.angle))

    def _on_hp_changed(self):
        self._emit_action(EntityHpChangedAction.build(self.id, self._body.hp))

    def _emit_action(self, action: Action):
        self._event_bus.emit('action', action)
        
    