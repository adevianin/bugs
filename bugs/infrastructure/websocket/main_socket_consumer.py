from channels.generic.websocket import WebsocketConsumer
from infrastructure.event_bus import event_bus
# from infrastructure.models import User
import json
from typing import Dict

class MainSocketConsumer(WebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        from infrastructure.engine.engine_facade import EngineFacade
        self._engine_facade = EngineFacade.get_instance()
        self._init_pack_sent = False

    def connect(self):
        self._user = self.scope["user"]

        event_bus.add_listener('email_verified', self._on_email_verified)
        event_bus.add_listener(f'init_step_data_pack_ready:{self._user.id}', self._on_init_step_data_pack_ready)
        event_bus.add_listener('step_data_pack_ready', self._on_step_data_pack_ready)
        event_bus.add_listener('engine_connection_error', self._on_engine_connection_error)

        if self._user.is_authenticated and self._engine_facade.is_game_working:
            self.accept()
            self._engine_facade.connect_player(self._user.id)
        else:
            self.close()
        
    def disconnect(self, code):
        self._engine_facade.disconnect_player(self._user.id)
        event_bus.remove_listener('email_verified', self._on_email_verified)
        event_bus.remove_listener(f'init_step_data_pack_ready:{self._user.id}', self._on_init_step_data_pack_ready)
        event_bus.remove_listener('step_data_pack_ready', self._on_step_data_pack_ready)
        event_bus.remove_listener('engine_connection_error', self._on_engine_connection_error)
        return super().disconnect(code)

    def _on_init_step_data_pack_ready(self, data: Dict):
        player_id = self._user.id
        msg = {
            'type': 'init_step',
            'step': data['step'],
            'season': data['season'],
            'world': data['world'],
            'specie': data['players_data'][player_id]['specie'],
            'nuptialMales': data['players_data'][player_id]['nuptial_males'],
            'consts': data['consts'],
            'notifications': data['players_data'][player_id]['notifications'],
            'rating': data['rating']
        }
        self.send(json.dumps(msg))
        self._init_pack_sent = True

    def _on_step_data_pack_ready(self, data: Dict):
        if self._init_pack_sent:
            player_id = self._user.id
            personal_actions = data['personal_actions'].get(player_id, [])
            common_actions = data['common_actions']
            msg = {
                'type': 'step',
                'step': data['step'],
                'season': data['season'],
                'actions': common_actions + personal_actions
            }
            self.send(json.dumps(msg))

    def _on_email_verified(self, user):
        if self._user.id == user.id:
            self.send(json.dumps({
                'type': 'email_verified'
            }))

    def _on_engine_connection_error(self):
        self.close(4001)
            
