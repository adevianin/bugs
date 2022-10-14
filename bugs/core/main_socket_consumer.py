from channels.generic.websocket import WebsocketConsumer
from core.world import World
import json

class MainSocketConsumer(WebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._world = World.get_instance()

    def connect(self):
        self.accept()
        self.send(json.dumps({
            'type': 'whole_world',
            'world': self._world.toJSON()
        }))