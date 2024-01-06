from core.world.utils.event_emiter import EventEmitter
from core.world.entities.base.entity import Entity
from core.world.entities.base.entity_types import EntityTypes
from typing import List
from core.world.entities.map.map import Map
from .relation_tester import RelationTester
from core.world.entities.action.base.action import Action
from abc import ABC
from core.world.entities.base.live_entity.live_entity import LiveEntity

class Colony(ABC):

    def __init__(self, id: int, member_type: EntityTypes, event_bus: EventEmitter, map: Map, relation_tester: RelationTester):
        self._id = id
        self._event_bus = event_bus
        self._member_type = member_type
        self._map = map
        self._relation_tester = relation_tester

        for member in self.get_my_members():
            self._handle_my_member(member)

        self._event_bus.add_listener('entity_died', self._on_entity_died)
        self._event_bus.add_listener('entity_born', self._on_entity_born)

    @property
    def id(self):
        return self._id
    
    @property
    def member_type(self):
        return self._member_type
    
    def get_my_members(self) -> List[LiveEntity]:
        return self._map.get_entities(from_colony_id=self.id, entity_types=[self._member_type])
    
    def _on_my_entity_born(self, entity: Entity):
        if entity.type == self.member_type:
            self._handle_my_member(entity)

    def _on_my_entity_died(self, entity: Entity):
        pass
    
    def _handle_my_member(self, member: LiveEntity):
        member.body.set_relation_tester(self._relation_tester)
    
    def _on_entity_died(self, entity: Entity):
        is_mine = entity.from_colony_id == self._id
        if is_mine:
            self._on_my_entity_died(entity)

    def _on_entity_born(self, entity: Entity):
        is_mine = entity.from_colony_id == self._id
        if is_mine:
            self._on_my_entity_born(entity)

    def _send_signal_to_members(self, signal: dict):
        my_members = self.get_my_members()
        for member in my_members:
            member.body.receive_colony_signal(signal)

    def _emit_action(self, action: Action):
        self._event_bus.emit('action', action)
