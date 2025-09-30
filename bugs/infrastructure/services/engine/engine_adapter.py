import redis.exceptions
from bugs.settings import WORLD_ID, RATING_GENERATION_PERIOD, WORLD_BACKUP_PERIOD
from typing import List, Dict
import threading, redis, json, time
import asyncio
from asgiref.sync import async_to_sync
from infrastructure.event_bus import EventBus
from infrastructure.db.repositories.world_data_repository import WorldDataRepository
from infrastructure.db.repositories.usernames_repository import UsernamesRepository
from .exceptions import EngineError, EngineStateConflictError, EngineResponseTimeoutError
from infrastructure.services.world_backup_saver import WorldBackupSaver
import logging

class EngineAdapter:
    WAIT_COMMAND_RESULT_TIMEOUT = 10
    CHANNEL_ENGINE_IN = 'engine_in'
    CHANNEL_ENGINE_OUT = 'engine_out'

    def __init__(self, event_bus: EventBus, world_data_repository: WorldDataRepository, usernames_repository: UsernamesRepository, redis: redis.Redis, 
                 world_backup_saver: WorldBackupSaver, logger: logging.Logger):
        self._event_bus = event_bus
        self._logger = logger
        
        self._redis = redis

        self._world_data_repository = world_data_repository
        self._usernames_repository = usernames_repository

        self._last_used_command_id = 0
        self._command_futures: Dict[str, asyncio.Future] = {}
        self._generate_id_lock = threading.Lock()

        self._world_backup_saver = world_backup_saver

        self._listen_engine_out()

    @property
    def is_game_working(self):
        status = self.get_world_status()
        return status['is_world_inited'] and status['is_world_stepping']
    
    # <ADMIN_COMMANDS>
    def init_world_admin_command(self):
        world_data = self._world_data_repository.get(WORLD_ID)
        async_to_sync(self._send_command_to_engine)('init_world', {
            'world_data': world_data,
            'users_data': self._usernames_repository.get_usernames()
        }, True)

    def save_world_admin_command(self):
        world_data = async_to_sync(self._send_command_to_engine)('get_world_state', None, True)
        self._world_data_repository.push(WORLD_ID, world_data)

    def count_ants_command(self):
        return async_to_sync(self._send_command_to_engine)('count_ants', None, True)

    def populate_for_performance_test_command(self, player_id: int):
        async_to_sync(self._send_command_to_engine)('populate_for_performance_test', player_id, True)
    
    def run_world_admin_command(self):
        async_to_sync(self._send_command_to_engine)('start_world_stepping', None, True)

    def stop_world_admin_command(self):
        async_to_sync(self._send_command_to_engine)('stop_world_stepping', None, True)

    def expand_map_admin_command(self, chunk_rows: int, chunk_cols: int):
        async_to_sync(self._send_command_to_engine)('expand_map', {
            'chunk_rows': chunk_rows,
            'chunk_cols': chunk_cols
        }, True)

    def get_world_data(self):
        return async_to_sync(self._send_command_to_engine)('get_world_state', None, True)

    def _generate_rating_command(self):
        def send_command():
            try:
                async_to_sync(self._send_command_to_engine)('generate_rating', self._usernames_repository.get_usernames(), True)
            except Exception as e:
                self._logger.error('rating generation error', exc_info=e)
        
        redis_watcher_thread = threading.Thread(target=send_command, daemon=True)
        redis_watcher_thread.start()

    def _backup_world_command(self):
        def backup():
            try:
                world_data = async_to_sync(self._send_command_to_engine)('get_world_state', None, True)
                self._world_backup_saver.save_backup(world_data)
            except Exception as e:
                self._logger.error('error during backup', exc_info=e)

        redis_watcher_thread = threading.Thread(target=backup, daemon=True)
        redis_watcher_thread.start()

    # </ADMIN_COMMANDS>

    # <PLAYER_COMMANDS>
    def connect_player(self, player_id: int):
        self._send_msg_to_engine('player_connect_request', {
            'player_id': player_id
        })

    def disconnect_player(self, player_id: int):
        self._send_msg_to_engine('player_disconect_request', {
            'player_id': player_id
        })

    async def stop_operation_command(self, user_id: int, colony_id: int, operation_id: int):
        return await self._send_command_to_engine('stop_operation', {
            'user_id': user_id,
            'colony_id': colony_id,
            'operation_id': operation_id,
        })
    
    async def build_new_sub_nest_operation_command(self, user_id: int, performing_colony_id: int, building_site: List[int], workers_count: int, warriors_count: int, nest_name: str):
        return await self._send_command_to_engine('build_new_sub_nest_operation', {
            'user_id': user_id,
            'performing_colony_id': performing_colony_id,
            'building_site': building_site,
            'workers_count': workers_count,
            'warriors_count': warriors_count,
            'nest_name': nest_name,
        })
    
    async def destroy_nest_operation_command(self, user_id: int, performing_colony_id: int, nest_id: int, workers_count: int, warriors_count: int):
        return await self._send_command_to_engine('destroy_nest_operation', {
            'user_id': user_id,
            'performing_colony_id': performing_colony_id,
            'nest_id': nest_id,
            'workers_count': workers_count,
            'warriors_count': warriors_count
        })

    async def pillage_nest_operation_command(self, user_id: int, performing_colony_id: int, nest_to_pillage_id: int, nest_for_loot_id: int, workers_count: int, warriors_count: int):
        return await self._send_command_to_engine('pillage_nest_operation', {
            'user_id': user_id,
            'performing_colony_id': performing_colony_id,
            'nest_to_pillage_id': nest_to_pillage_id,
            'nest_for_loot_id': nest_for_loot_id,
            'workers_count': workers_count,
            'warriors_count': warriors_count
        })

    async def transport_food_operation_command(self, user_id: int, performing_colony_id: int, from_nest_id: int, to_nest_id: int, workers_count: int, warriors_count: int):
        return await self._send_command_to_engine('transport_food_operation', {
            'user_id': user_id,
            'performing_colony_id': performing_colony_id,
            'from_nest_id': from_nest_id,
            'to_nest_id': to_nest_id,
            'workers_count': workers_count,
            'warriors_count': warriors_count
        })

    async def build_fortification_operation_command(self, user_id: int, performing_colony_id: int, nest_id: int, workers_count: int):
        return await self._send_command_to_engine('build_fortification_operation', {
            'user_id': user_id,
            'performing_colony_id': performing_colony_id,
            'nest_id': nest_id,
            'workers_count': workers_count
        })
    
    async def bring_bug_operation_command(self, user_id: int, performing_colony_id: int, nest_id: int):
        return await self._send_command_to_engine('bring_bug_operation', {
            'user_id': user_id,
            'performing_colony_id': performing_colony_id,
            'nest_id': nest_id
        })

    async def add_egg_command(self, user_id: int, nest_id: int, name: str, is_fertilized: bool):
        return await self._send_command_to_engine('add_egg', {
            'user_id': user_id,
            'name': name,
            'nest_id': nest_id,
            'is_fertilized': is_fertilized
        })

    async def change_egg_caste_command(self, user_id: int, nest_id: int, egg_id: str, ant_type: str):
        return await self._send_command_to_engine('change_egg_caste', {
            'user_id': user_id,
            'nest_id': nest_id,
            'egg_id': egg_id,
            'ant_type': ant_type,
        })

    async def change_egg_name_command(self, user_id: int, nest_id: int, egg_id: str, name: str):
        return await self._send_command_to_engine('change_egg_name', {
            'user_id': user_id,
            'nest_id': nest_id,
            'egg_id': egg_id,
            'name': name,
        })


    async def delete_egg_command(self, user_id: int, nest_id: int, egg_id: str):
        return await self._send_command_to_engine('delete_egg', {
            'user_id': user_id,
            'nest_id': nest_id,
            'egg_id': egg_id
        })

    async def delete_larva_command(self, user_id: int, nest_id: int, larva_id: str):
        return await self._send_command_to_engine('delete_larva', {
            'user_id': user_id,
            'nest_id': nest_id,
            'larva_id': larva_id
        })

    async def found_colony_command(self, user_id: int, queen_id: int, nuptial_male_id: int, nest_building_site: List[int], colony_name: str):
        return await self._send_command_to_engine('found_colony', {
            'user_id': user_id,
            'queen_id': queen_id,
            'nuptial_male_id': nuptial_male_id,
            'nest_building_site': nest_building_site,
            'colony_name': colony_name
        })

    async def born_new_antara_command(self, user_id: int):
        return await self._send_command_to_engine('born_new_antara', {
            'user_id': user_id
        })

    async def fly_nuptial_flight_command(self, user_id: int, ant_id: int):
        return await self._send_command_to_engine('fly_nuptial_flight', {
            'user_id': user_id,
            'ant_id': ant_id
        })

    async def change_ant_guardian_behavior_command(self, user_id: int, ant_id: int, guaridan_behavior: str):
        return await self._send_command_to_engine('change_ant_guardian_behavior', {
            'user_id': user_id,
            'ant_id': ant_id,
            'guaridan_behavior': guaridan_behavior,
        })

    async def change_ant_cooperative_behavior_command(self, user_id: int, ant_id: int, is_enabled: bool):
        return await self._send_command_to_engine('change_ant_cooperative_behavior', {
            'user_id': user_id,
            'ant_id': ant_id,
            'is_enabled': is_enabled,
        })

    async def relocate_ant_command(self, user_id: int, ant_id: int, nest_id: int):
        return await self._send_command_to_engine('relocate_ant', {
            'user_id': user_id,
            'ant_id': ant_id,
            'nest_id': nest_id,
        })

    async def change_specie_schema_command(self, user_id: int, specie_schema: Dict):
        return await self._send_command_to_engine('change_specie_schema', {
            'user_id': user_id,
            'specie_schema': specie_schema,
        })

    async def rename_nest_command(self, user_id: int, nest_id: int, name: str):
        return await self._send_command_to_engine('rename_nest', {
            'user_id': user_id,
            'name': name,
            'nest_id': nest_id
        })

    # </PLAYER_COMMANDS>

    def get_world_status(self):
        is_world_inited = False
        is_world_stepping = False
        players_online = -1

        try:
            status = self._redis.get('engine_status')
            if status:
                status = json.loads(status)
                is_world_inited = status['is_world_inited']
                is_world_stepping = status['is_world_stepping']
                players_online = status['players_online']
        except redis.exceptions.ConnectionError as e:
            self._logger.error('redis connection error. couldnt get world status')

        return {
            'is_world_inited': is_world_inited,
            'is_world_stepping': is_world_stepping,
            'players_online': players_online
        }

    def _send_msg_to_engine(self, type: str, data: Dict = None):
        try:
            self._redis.publish(EngineAdapter.CHANNEL_ENGINE_IN, json.dumps({
                'type': type,
                'data': data
            }))
        except redis.exceptions.ConnectionError as e:
            self._logger.error('redis connection error. couldnt send msg to engine')

    def _generate_command_id(self):
        with self._generate_id_lock:
            self._last_used_command_id += 1
            return self._last_used_command_id

    async def _send_command_to_engine(self, type: str, data: Dict, is_from_admin: bool = False):
        command_id = self._generate_command_id()
        loop = asyncio.get_running_loop()
        command_future = loop.create_future()
        self._command_futures[command_id] = command_future

        self._send_msg_to_engine('command', {
            'id': command_id,
            'from': 'admin' if is_from_admin else 'player',
            'type': type,
            'data': data
        })

        try:
            res = await asyncio.wait_for(
                command_future,
                timeout=self.WAIT_COMMAND_RESULT_TIMEOUT
            )
            return res
        except asyncio.TimeoutError:
            self._logger.error(f'command time out, command type={type}')
            raise EngineResponseTimeoutError()
        finally:
            self._command_futures.pop(command_id, None)

    def _listen_engine_out(self):
        def listen():
            while True:
                try:
                    pubsub = self._redis.pubsub(ignore_subscribe_messages=True)
                    pubsub.subscribe(EngineAdapter.CHANNEL_ENGINE_OUT)
                    for redis_msg in pubsub.listen():
                        msg = json.loads(redis_msg['data'])
                        data = msg['data']
                        match (msg['type']):
                            case 'init_step_data_pack':
                                self._on_init_step_data_pack_msg(data)
                            case 'step_data_pack':
                                self._on_step_data_pack_msg(data)
                            case 'command_result':
                                self._on_command_result(data)
                            case 'command_error':
                                self._on_command_error(data)
                except redis.exceptions.ConnectionError as e:
                    self._logger.error('redis connection error. listen engine_out')
                    self._event_bus.emit('engine_connection_error')
                    time.sleep(5)

        world_thread = threading.Thread(target=listen, daemon=True)
        world_thread.start()

    def _on_init_step_data_pack_msg(self, data: Dict):
        data['players_data'] = {int(player_id): player_data for player_id, player_data in data['players_data'].items()}
        for player_id in data['players_data']:
            self._event_bus.emit(f'init_step_data_pack_ready:{player_id}', data)

    def _on_step_data_pack_msg(self, data: Dict):
        data['personal_actions'] = {int(player_id): actions for player_id, actions in data['personal_actions'].items()}
        self._event_bus.emit(f'step_data_pack_ready', data)
        self._step_number_manager(data['step'])

    def _step_number_manager(self, step_number: int):
        if step_number % RATING_GENERATION_PERIOD == 0:
            self._generate_rating_command()
        if step_number % WORLD_BACKUP_PERIOD == 0:
            self._backup_world_command()
    
    def _on_command_result(self, data: Dict):
        command_id = data['command_id']
        if command_id in self._command_futures:
            future = self._command_futures[command_id]
            future._loop.call_soon_threadsafe(future.set_result, data['result'])

    def _on_command_error(self, data: Dict):
        command_id = data['command_id']
        if command_id in self._command_futures:
            future = self._command_futures[command_id]
            match (data['err_code']):
                case 'state_conflict_error':
                    exception = EngineStateConflictError(data['err_data']['step'])
                case _:
                    exception = EngineError()
            
            future._loop.call_soon_threadsafe(future.set_exception, exception)
