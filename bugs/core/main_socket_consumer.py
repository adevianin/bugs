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
        self._user = self.scope["user"]

        if self._user.is_authenticated:
            self.accept()
        else:
            self.close()

        self._world_facade.add_listener('step_start', self._on_step_start)
        self._world_facade.add_listener('action_occurred', self._on_action)

    def disconnect(self, code):
        self._world_facade.remove_listener('step_start', self._on_step_start)
        self._world_facade.remove_listener('action_occurred', self._on_action)
        return super().disconnect(code)

    def _on_step_start(self, step_number: int):
        if not self._synced:
            self.send(json.dumps({
                'type': 'sync_step',
                'world': self._world_facade.world.to_json()
            }))
            self._synced = True

    def _on_action(self, action: Action):
        if self._synced:
            self.send(json.dumps({
                'type': 'action',
                'action': action.to_json()
            }))
        
