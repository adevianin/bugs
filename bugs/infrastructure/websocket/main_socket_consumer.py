from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
from infrastructure.event_bus import event_bus
from infrastructure.engine.exceptions import EngineError, EngineStateConflictError
import json
from typing import Dict
import logging


class MainSocketConsumer(AsyncWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        from infrastructure.engine.engine_adapter import EngineAdapter
        self._ea = EngineAdapter.get_instance()
        self._init_pack_sent = False
        self._logger = logging.getLogger('request_logger')

        self._sync_send_step_pack = async_to_sync(self._send_step_pack)

    async def connect(self):
        self._user = self.scope["user"]

        event_bus.add_listener('email_verified', self._on_email_verified)
        event_bus.add_listener(f'init_step_data_pack_ready:{self._user.id}', self._on_init_step_data_pack_ready)
        event_bus.add_listener('step_data_pack_ready', self._on_step_data_pack_ready)
        event_bus.add_listener('engine_connection_error', self._on_engine_connection_error)

        if self._user.is_authenticated and self._ea.is_game_working:
            await self.accept()
            self._ea.connect_player(self._user.id)
        else:
            await self.close()

    async def disconnect(self, code):
        self._ea.disconnect_player(self._user.id)
        event_bus.remove_listener('email_verified', self._on_email_verified)
        event_bus.remove_listener(f'init_step_data_pack_ready:{self._user.id}', self._on_init_step_data_pack_ready)
        event_bus.remove_listener('step_data_pack_ready', self._on_step_data_pack_ready)
        event_bus.remove_listener('engine_connection_error', self._on_engine_connection_error)
        return await super().disconnect(code)
    
    async def receive(self, text_data = None, bytes_data = None):
        msg = json.loads(text_data)
        match (msg['type']):
            case 'player_command':
                await self._on_player_command_msg(msg)

    async def _on_player_command_msg(self, command_msg: Dict):
        user_id = self._user.id
        data = command_msg['data']
        command_id = command_msg['id']
        command_type = command_msg['player_command_type']

        try:
            await self._handle_player_command(user_id, command_id, command_type, data)
        except EngineStateConflictError as e:
            await self._send_player_command_result(command_id, False, { 'err_type': 'state_conflict_error', 'step': e.step})
        except EngineError as e:
            self._logger.error(f'player command engine error. command = {command_type}', exc_info=e)
            await self._send_player_command_result(command_id, False, { 'err_type': 'engine_error' })
        except Exception as e:
            self._logger.error(f'player command unknown error. command = {command_type}', exc_info=e)
            await self._send_player_command_result(command_id, False, { 'err_type': 'unknown' })

    async def _handle_player_command(self, user_id: str, command_id: str, player_command_type: str, data: Dict):
        match (player_command_type):
            case 'fly_nuptial_flight':
                await self._ea.fly_nuptial_flight_command(user_id, data['ant_id'])
                await self._send_player_command_result(command_id)
            case 'change_ant_guardian_behavior':
                await self._ea.change_ant_guardian_behavior_command(user_id, data['ant_id'], data['behavior_value'])
                await self._send_player_command_result(command_id)
            case 'change_ant_cooperative_behavior':
                await self._ea.change_ant_cooperative_behavior_command(user_id, data['ant_id'], data['is_enabled'])
                await self._send_player_command_result(command_id)
            case 'relocate_ant':
                await self._ea.relocate_ant_command(user_id, data['ant_id'], data['nest_id'])
                await self._send_player_command_result(command_id)

            case 'stop_operation':
                operation_id = await self._ea.stop_operation_command(user_id, data['colony_id'], data['operation_id'])
                await self._send_player_command_result(command_id, True, operation_id)
            case 'build_new_sub_nest_operation':
                operation_id = await self._ea.build_new_sub_nest_operation_command(user_id, data['performing_colony_id'], data['building_site'], data['workers_count'], data['warriors_count'], data['nest_name'])
                await self._send_player_command_result(command_id, True, operation_id)
            case 'destroy_nest_operation':
                operation_id = await self._ea.destroy_nest_operation_command(user_id, data['performing_colony_id'], data['nest_id'], data['workers_count'], data['warriors_count'])
                await self._send_player_command_result(command_id, True, operation_id)
            case 'pillage_nest_operation':
                operation_id = await self._ea.pillage_nest_operation_command(user_id, data['performing_colony_id'], data['nest_to_pillage_id'], data['nest_for_loot_id'], data['workers_count'], data['warriors_count'])
                await self._send_player_command_result(command_id, True, operation_id)
            case 'transport_food_operation':
                operation_id = await self._ea.transport_food_operation_command(user_id, data['performing_colony_id'], data['from_nest_id'], data['to_nest_id'], data['workers_count'], data['warriors_count'])
                await self._send_player_command_result(command_id, True, operation_id)
            case 'build_fortification_operation':
                operation_id = await self._ea.build_fortification_operation_command(user_id, data['performing_colony_id'], data['nest_id'], data['workers_count'])
                await self._send_player_command_result(command_id, True, operation_id)
            case 'bring_bug_operation':
                operation_id = await self._ea.bring_bug_operation_command(user_id, data['performing_colony_id'], data['nest_id'])
                await self._send_player_command_result(command_id, True, operation_id)

            case 'add_egg':
                egg_id = await self._ea.add_egg_command(user_id, data['nest_id'], data['name'], data['is_fertilized'])
                await self._send_player_command_result(command_id, True, egg_id)
            case 'change_egg_caste':
                await self._ea.change_egg_caste_command(user_id, data['nest_id'], data['egg_id'], data['ant_type'])
                await self._send_player_command_result(command_id)
            case 'change_egg_name':
                await self._ea.change_egg_name_command(user_id, data['nest_id'], data['egg_id'], data['name'])
                await self._send_player_command_result(command_id)
            case 'delete_egg':
                await self._ea.delete_egg_command(user_id, data['nest_id'], data['egg_id'])
                await self._send_player_command_result(command_id)
            case 'delete_larva':
                await self._ea.delete_larva_command(user_id, data['nest_id'], data['larva_id'])
                await self._send_player_command_result(command_id)
            case 'rename_nest':
                await self._ea.rename_nest_command(user_id, data['nest_id'], data['name'])
                await self._send_player_command_result(command_id)

            case 'found_colony':
                await self._ea.found_colony_command(user_id, data['queen_id'], data['nuptial_male_id'], data['nest_building_site'], data['colony_name'])
                await self._send_player_command_result(command_id)
            case 'born_new_antara':
                await self._ea.born_new_antara_command(user_id)
                await self._send_player_command_result(command_id)
            case 'change_specie_schema':
                await self._ea.change_specie_schema_command(user_id, data['specie_schema'])
                await self._send_player_command_result(command_id)

    async def _send_player_command_result(self, command_id: str, is_success: bool = True, data: Dict = {}):
        await self.send(json.dumps({
            'type': 'command_result',
            'id': command_id,
            'success': is_success,
            'data': data
        }))

    def _on_init_step_data_pack_ready(self, data: Dict):
        if not self._init_pack_sent:
            async_to_sync(self._send_init_pack)(data)

    async def _send_init_pack(self, data: Dict):
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

    def _on_step_data_pack_ready(self, data: Dict):
        if self._init_pack_sent:
            self._sync_send_step_pack(data)

    async def _send_step_pack(self, data: Dict):
        player_id = self._user.id
        personal_actions = data['personal_actions'].get(player_id, [])
        common_actions = data['common_actions']
        msg = {
            'type': 'step',
            'step': data['step'],
            'season': data['season'],
            'actions': common_actions + personal_actions
        }
        await self.send(json.dumps(msg))

    def _on_email_verified(self, user):
        if self._user.id == user.id:
            async_to_sync(self.send)(json.dumps({
                'type': 'email_verified'
            }))

    def _on_engine_connection_error(self):
        async_to_sync(self.close)(4001)