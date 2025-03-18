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
from .ownership_config import OwnershipConfig
from core.world.entities.world.notification.notifications.notification import Notification
from .death_record.base_death_record import BaseDeathRecord
from .death_record.simple_death_record import SimpleDeathRecord
import uuid

class Entity(ABC):

    _body: Body

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, type: EntityTypes, ownership: OwnershipConfig, body: Body):
        self._event_bus = event_bus
        self._events = events
        self._id: int = id
        self._type: EntityTypes = type
        self._from_colony_id = ownership.owner_colony_id
        self._owner_id = ownership.owner_user_id
        self._body = body
        self._is_removal_blocked = False
        self._removal_block_ids = []

        self._body.events.add_listener('died', self._on_body_died)
        self._body.events.add_listener('angle_changed', self._on_angle_changed)
        self._body.events.add_listener('hp_changed', self._on_hp_changed)
        self._body.events.add_listener('position_changed', self._on_position_changed)

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
        return not self.is_died
    
    @property
    def is_pending_removal(self):
        return self.is_died
    
    @property
    def is_removal_blocked(self):
        return self._is_removal_blocked

    def simple_die(self):
        self._body.die(SimpleDeathRecord(self.body.position))

    @abstractmethod
    def do_step(self):
        pass

    def block_removal(self):
        block_id = uuid.uuid4().hex
        self._removal_block_ids.append(block_id)
        self._is_removal_blocked = True
        return block_id

    def unblock_removal(self, block_id: str):
        self._removal_block_ids.remove(block_id)
        if len(self._removal_block_ids) == 0:
            self._is_removal_blocked = False
            self._event_bus.emit('entity_removal_unblocked', self)

    def _on_body_died(self, death_record: BaseDeathRecord):
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

    def _emit_notification(self, notification: Notification):
        self._event_bus.emit('notification', notification)

    def _on_position_changed(self):
        self._event_bus.emit('entity_moved', self)
        
    