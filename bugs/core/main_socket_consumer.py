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
        self._world_facade.add_listener('step_done', self._send_previous_step_actions)

    def disconnect(self, code):
        self._world_facade.remove_listener('step_done', self._send_previous_step_actions)
        return super().disconnect(code)

    def _send_whole_world(self):
        self.send(json.dumps({
            'type': 'whole_world',
            'world': self._world_facade.get_previous_step_world_state(),
            'actions': self._world_facade.get_previous_step_actions()
        }))

    def _send_previous_step_actions(self):
        self.send(json.dumps({
            'type': 'step_actions',
            'actions': self._world_facade.get_previous_step_actions()
        }))
        
