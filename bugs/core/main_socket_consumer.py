from channels.generic.websocket import WebsocketConsumer
from core.world import World
import json

class MainSocketConsumer(WebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._world = World.get_instance()

    def connect(self):
        self.accept()
        self._send_whole_world()
        self._world.main_event_bus.add_listener('entity_changed', self._send_changed_entity)

    def disconnect(self, code):
        self._world.main_event_bus.remove_listener('entity_changed', self._send_changed_entity)
        return super().disconnect(code)
        

    def _send_whole_world(self):
        self.send(json.dumps({
            'type': 'whole_world',
            'world': self._world.toJSON()
        }))

    def _send_changed_entity(self, entity):
        self.send(json.dumps({
            'type': 'entity_changed',
            'entity': entity.toJSON()
        }))