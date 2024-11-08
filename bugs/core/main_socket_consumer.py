from channels.generic.websocket import WebsocketConsumer
from core.world.world_facade import WorldFacade
import json

class MainSocketConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._world_facade = WorldFacade.get_instance()
        self._inited = False

    def connect(self):
        self._user = self.scope["user"]

        if self._user.is_authenticated:
            self.accept()
        else:
            self.close()

        self._world_facade.add_listener('step', self._on_step_done)

    def disconnect(self, code):
        self._world_facade.remove_listener('step', self._on_step_done)
        return super().disconnect(code)
    
    def receive(self, text_data=None, bytes_data=None):
        msg = json.loads(text_data)

    def _on_step_done(self, step_number: int):
        if self._inited:
            self.send(json.dumps({
                'type': 'step',
                'step': step_number,
                'actions': self._world_facade.get_current_actions_pack_for_client(self._user.id)
            }))
        else:
            self.send(json.dumps({
                'type': 'init_step',
                'world': self._world_facade.get_world_for_client(),
                'specie': self._world_facade.get_specie_for_client(self._user.id),
                'nuptialMales': self._world_facade.get_nuptial_males_for_client(self._user.id),
                'consts': self._world_facade.get_consts_for_client(),
                'notifications': self._world_facade.get_notifications_for_client(self._user.id),
                'rating': self._world_facade.get_rating()
            }))
            self._inited = True
            
