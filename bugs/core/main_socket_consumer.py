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
        self._world_facade.add_listener('activity_bag_is_ready', self._on_activity_bag_is_ready)

    def disconnect(self, code):
        self._world_facade.remove_listener('activity_bag_is_ready', self._on_activity_bag_is_ready)
        return super().disconnect(code)

    def _send_whole_world(self):
        bag_start_step, world_state, actions = self._world_facade.get_activity_bag()
        self.send(json.dumps({
            'type': 'whole_world',
            'world': world_state,
            'actions': actions,
            'start_step': bag_start_step
        }))

    def _on_activity_bag_is_ready(self):
        bag_start_step, world_state, actions = self._world_facade.get_activity_bag()
        self.send(json.dumps({
            'type': 'step_actions',
            'actions': actions
        }))
        
