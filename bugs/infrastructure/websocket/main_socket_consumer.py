from channels.generic.websocket import AsyncWebsocketConsumer
from infrastructure.event_bus import get_event_bus

import json, logging
from typing import Dict

class MainSocketConsumer(AsyncWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        #lazy import to avoid importing services using ORM before ORM initialization
        from infrastructure.services.providers import get_engine_adapter, get_player_command_handler
        self._ea = get_engine_adapter()
        self._pch = get_player_command_handler()
        self._logger = logging.getLogger('django_logger')
        self._event_bus = get_event_bus()
        self._init_pack_sent = False

    async def connect(self):
        self._user = self.scope["user"]

        self._event_bus.add_listener('email_verified', self._on_email_verified)
        self._event_bus.add_listener(f'init_step_data_pack_ready:{self._user.id}', self._on_init_step_data_pack_ready)
        self._event_bus.add_listener('step_data_pack_ready', self._on_step_data_pack_ready)
        self._event_bus.add_listener('engine_connection_error', self._on_engine_connection_error)

        if self._user.is_authenticated and await self._ea.is_game_working:
            await self.accept()
            await self._ea.connect_player(self._user.id)
        else:
            await self.close()

    async def disconnect(self, code):
        await self._ea.disconnect_player(self._user.id)
        self._event_bus.remove_listener('email_verified', self._on_email_verified)
        self._event_bus.remove_listener(f'init_step_data_pack_ready:{self._user.id}', self._on_init_step_data_pack_ready)
        self._event_bus.remove_listener('step_data_pack_ready', self._on_step_data_pack_ready)
        self._event_bus.remove_listener('engine_connection_error', self._on_engine_connection_error)
        return await super().disconnect(code)
    
    async def receive(self, text_data = None, bytes_data = None):
        try:
            msg = json.loads(text_data)
            match (msg['type']):
                case 'player_command':
                    await self._on_player_command_msg(msg)
        except Exception as e:
            self._logger.warning('WebsocketConsumer error', exc_info=e)

    async def _on_player_command_msg(self, command_msg: Dict):
        is_success, data = await self._pch.handle_command_msg(self._user.id, command_msg['player_command_type'], command_msg['data'])

        await self.send(json.dumps({
            'type': 'command_result',
            'id': command_msg['id'],
            'success': is_success,
            'data': data
        }))

    async def _on_init_step_data_pack_ready(self, data: Dict):
        if not self._init_pack_sent:
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
            await self.send(json.dumps(msg))
            self._init_pack_sent = True

    async def _on_step_data_pack_ready(self, pack: Dict):
        if self._init_pack_sent:
            player_id = self._user.id
            personal_actions = pack['personal_actions'].get(player_id, [])
            common_actions = pack['common_actions']
            msg = {
                'type': 'step',
                'step': pack['step'],
                'season': pack['season'],
                'actions': common_actions + personal_actions
            }
            await self.send(json.dumps(msg))

    async def _on_email_verified(self, user):
        if self._user.id == user.id:
            await self.send(json.dumps({
                'type': 'email_verified'
            }))

    async def _on_engine_connection_error(self):
        await self.close(4001)