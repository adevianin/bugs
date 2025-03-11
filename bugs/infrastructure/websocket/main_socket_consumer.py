from channels.generic.websocket import WebsocketConsumer
from core.world.world_facade import WorldFacade
from .step_data_manager import StepDataManager
import json

class MainSocketConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._world_facade = WorldFacade.get_instance()
        self._step_data_manager = StepDataManager.get_instance()
        self._inited = False

    def connect(self):
        self._user = self.scope["user"]

        if self._user.is_authenticated and self._world_facade.is_world_running:
            self._world_facade.ensure_starter_pack_built_for_player(self._user.id)
            self.accept()
        else:
            self.close()

        self._step_data_manager.events.add_listener('step_data_ready', self._on_step_data_ready)

    def disconnect(self, code):
        self._step_data_manager.events.remove_listener('step_data_ready', self._on_step_data_ready)
        return super().disconnect(code)
    
    def receive(self, text_data=None, bytes_data=None):
        msg = json.loads(text_data)

    def _on_step_data_ready(self):
        if self._inited:
            data = self._step_data_manager.get_current_step_data(self._user.id)
            self.send(json.dumps(data))
        else:
            data = self._step_data_manager.get_init_step_data(self._user.id)
            self.send(json.dumps(data))
            self._inited = True
            
