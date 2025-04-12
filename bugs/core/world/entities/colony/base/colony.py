from core.world.utils.event_emiter import EventEmitter
from core.world.entities.base.entity import Entity
from core.world.entities.base.entity_types import EntityTypes
from typing import List
from core.world.entities.map.map import Map
from .relation_tester import RelationTester
from core.world.entities.action.base.action import Action
from abc import ABC
from core.world.entities.base.live_entity.live_entity import LiveEntity
from core.world.entities.world.notification.notifications.notification import Notification

class Colony(ABC):

    def __init__(self, id: int, member_type: EntityTypes, event_bus: EventEmitter, map: Map, relation_tester: RelationTester):
        self._id = id
        self._event_bus = event_bus
        self._member_type = member_type
        self._map = map
        self._relation_tester = relation_tester
        self._cached_members = None

        for member in self.get_my_members():
            self._handle_my_member(member)

        self._event_bus.add_listener(f'colony_entity_died:{id}', self._on_colony_entity_died)
        self._event_bus.add_listener(f'colony_entity_born:{id}', self._on_colony_entity_born)
        self._event_bus.add_listener(f'entity_left_colony:{id}', self._on_entity_left_colony)
        self._event_bus.add_listener(f'entity_joined_colony:{id}', self._on_entity_joined_colony)

    @property
    def id(self):
        return self._id
    
    @property
    def member_type(self):
        return self._member_type
    
    def get_my_members(self) -> List[LiveEntity]:
        if not self._cached_members:
            self._cached_members = self._map.get_entities(from_colony_id=self.id, entity_types=[self._member_type])

        return self._cached_members
    
    def _on_entity_left_colony(self, entity: Entity):
        if entity.type == self._member_type:
            self._clear_cached_members()

    def _on_entity_joined_colony(self, entity: Entity):
        if entity.type == self._member_type:
            self._handle_my_member(entity)
            self._clear_cached_members()
    
    def _handle_my_member(self, member: LiveEntity):
        member.body.set_relation_tester(self._relation_tester)
    
    def _on_colony_entity_died(self, entity: Entity):
        if entity.type == self.member_type:
            self._clear_cached_members()

    def _on_colony_entity_born(self, entity: Entity):
        if entity.type == self.member_type:
            self._handle_my_member(entity)
            self._clear_cached_members()

    def _emit_action(self, action: Action):
        self._event_bus.emit('action', action)

    def _emit_notification(self, notification: Notification):
        self._event_bus.emit('notification', notification)

    def _send_signal_to_members(self, signal: dict):
        my_members = self.get_my_members()
        for member in my_members:
            member.body.receive_colony_signal(signal)

    def _clear_cached_members(self):
        self._cached_members = None