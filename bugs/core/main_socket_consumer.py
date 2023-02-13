from channels.generic.websocket import WebsocketConsumer
from core.world.world_facade import WorldFacade
import json

class MainSocketConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._world_facade = WorldFacade.get_instance()

    def connect(self):
        self.accept()
        self._send_whole_world()
        self._world_facade.add_listener('entity_changed', self._send_changed_entity)
        self._world_facade.add_listener('entity_deleted', self._send_entity_deleted)
        self._world_facade.add_listener('action_occured', self._send_action)

    def disconnect(self, code):
        self._world_facade.remove_listener('entity_changed', self._send_changed_entity)
        self._world_facade.remove_listener('entity_deleted', self._send_entity_deleted)
        self._world_facade.remove_listener('action_occured', self._send_action)
        return super().disconnect(code)

    def _send_whole_world(self):
        self.send(json.dumps({
            'type': 'whole_world',
            'world': self._world_facade.get_world_json()
        }))

    def _send_changed_entity(self, entity):
        self.send(json.dumps({
            'type': 'entity_changed',
            'entity': entity.to_json()
        }))

    def _send_entity_deleted(self, entity):
        self.send(json.dumps({
            'type': 'entity_deleted',
            'entity_id': entity.id
        }))

    def _send_action(self, action: dict):
        self.send(json.dumps({
            'type': 'entity_action',
            'action': action
        }))