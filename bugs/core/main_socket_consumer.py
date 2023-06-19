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

        self._my_colony = self._world_facade.get_my_colony(self._user.id)

        self._world_facade.add_listener('step_start', self._on_step_start)
        self._world_facade.add_listener('action_occurred', self._on_action)
        self._world_facade.add_listener(f'colony:{ self._my_colony.id }:changed', self._on_my_colony_changed)

    def disconnect(self, code):
        self._world_facade.remove_listener('step_start', self._on_step_start)
        self._world_facade.remove_listener('action_occurred', self._on_action)
        self._world_facade.remove_listener(f'colony:{ self._my_colony.id }:changed', self._on_my_colony_changed)
        return super().disconnect(code)
    
    def receive(self, text_data=None, bytes_data=None):
        msg = json.loads(text_data)

        match msg['type']:
            case 'command':
                self._world_facade.handle_command(msg['command'], self._user.id)
            case _:
                raise Exception('unknown type of client message')

    def _on_step_start(self, step_number: int):
        if not self._synced:
            self.send(json.dumps({
                'type': 'sync_step',
                'world': self._world_facade.world.to_public_json()
            }))
            self._synced = True

    def _on_action(self, action: Action):
        if self._synced:
            self.send(json.dumps({
                'type': 'action',
                'action': action.to_public_json()
            }))
    
    def _on_my_colony_changed(self):
        if self._synced:
            self.send(json.dumps({
                'type': 'colony_changes',
                'colony': self._my_colony.to_public_json()
            }))
