from channels.generic.websocket import WebsocketConsumer
from core.world.world_facade import WorldFacade
from core.world.entities.action import Action
import json

class MainSocketConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._world_facade = WorldFacade.get_instance()
        self._synced = False

    def connect(self):
        self.accept()
        self._world_facade.add_listener('sync_step', self._on_sync_step)
        self._world_facade.add_listener('action_occurred', self._on_action)

    def disconnect(self, code):
        self._world_facade.remove_listener('sync_step', self._on_sync_step)
        self._world_facade.remove_listener('action_occurred', self._on_action)
        return super().disconnect(code)

    def _on_sync_step(self, world_json):
        if self._synced:
            return
        self.send(json.dumps({
            'type': 'sync_step',
            'world': world_json
        }))
        self._synced = True

    def _on_action(self, action: Action):
        if not self._synced:
            return
        self.send(json.dumps({
            'type': 'action',
            'action': action.to_json()
        }))
        
