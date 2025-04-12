from bugs.settings import WORLD_ID, RATING_GENERATION_PERIOD
from typing import List, Dict
import threading, redis, json, time
from concurrent.futures import Future, TimeoutError
from infrastructure.event_bus import event_bus
from infrastructure.db.repositories.world_data_repository import WorldDataRepository
from infrastructure.db.repositories.usernames_repository import UsernamesRepository
from .exceptions import EngineError, EngineStateConflictError, EngineResponseTimeoutError

class EngineFacade:
    _instance = None

    WAIT_COMMAND_RESULT_TIMEOUT = 4
    CHANNEL_ENGINE_IN = 'engine_in'
    CHANNEL_ENGINE_OUT = 'engine_out'

    @classmethod
    def get_instance(cls) -> 'EngineFacade':
        return EngineFacade._instance

    def __init__(self, world_data_repository: WorldDataRepository, usernames_repository: UsernamesRepository, redis: redis.Redis):
        if EngineFacade._instance != None:
            raise Exception('EngineFacade is singleton')
        else:
            EngineFacade._instance = self

        self._redis = redis

        self._world_data_repository = world_data_repository
        self._usernames_repository = usernames_repository

        self._last_used_command_id = 0
        self._command_futures = {}

        self._listen_engine_out()
        self._start_rating_generation_command_sender()

    @property
    def is_game_working(self):
        status = self.get_world_status()
        return status['is_world_inited'] and status['is_world_stepping']
    
    # <ADMIN_COMMANDS>
    def init_world_admin_command(self):
        world_data = self._world_data_repository.get(WORLD_ID)
        self._send_command_to_engine('init_world', {
            'world_data': world_data,
            'users_data': self._usernames_repository.get_usernames()
        }, True, True)

    def save_world_admin_command(self):
        world_data = self._send_command_to_engine('get_world_state', None, True, True)
        self._world_data_repository.push(WORLD_ID, world_data)
    
    def run_world_admin_command(self):
        self._send_command_to_engine('start_world_stepping', None, True, True)

    def stop_world_admin_command(self):
        self._send_command_to_engine('stop_world_stepping', None, True, True)

    def expand_map_admin_command(self, chunk_rows: int, chunk_cols: int):
        self._send_command_to_engine('expand_map', {
            'chunk_rows': chunk_rows,
            'chunk_cols': chunk_cols
        }, True, True)

    def _generate_rating_command(self):
        self._send_command_to_engine('generate_rating', self._usernames_repository.get_usernames(), False, True)

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

    def stop_operation_command(self, user_id: int, colony_id: int, operation_id: int):
        return self._send_command_to_engine('stop_operation', {
            'user_id': user_id,
            'colony_id': colony_id,
            'operation_id': operation_id,
        }, True)
    
    def build_new_sub_nest_operation_command(self, user_id: int, performing_colony_id: int, building_site: List[int], workers_count: int, warriors_count: int, nest_name: str):
        return self._send_command_to_engine('build_new_sub_nest_operation', {
            'user_id': user_id,
            'performing_colony_id': performing_colony_id,
            'building_site': building_site,
            'workers_count': workers_count,
            'warriors_count': warriors_count,
            'nest_name': nest_name,
        }, True)
    
    def destroy_nest_operation_command(self, user_id: int, performing_colony_id: int, nest_id: int, workers_count: int, warriors_count: int):
        return self._send_command_to_engine('destroy_nest_operation', {
            'user_id': user_id,
            'performing_colony_id': performing_colony_id,
            'nest_id': nest_id,
            'workers_count': workers_count,
            'warriors_count': warriors_count
        }, True)

    def pillage_nest_operation_command(self, user_id: int, performing_colony_id: int, nest_to_pillage_id: int, nest_for_loot_id: int, workers_count: int, warriors_count: int):
        return self._send_command_to_engine('pillage_nest_operation', {
            'user_id': user_id,
            'performing_colony_id': performing_colony_id,
            'nest_to_pillage_id': nest_to_pillage_id,
            'nest_for_loot_id': nest_for_loot_id,
            'workers_count': workers_count,
            'warriors_count': warriors_count
        }, True)

    def transport_food_operation_command(self, user_id: int, performing_colony_id: int, from_nest_id: int, to_nest_id: int, workers_count: int, warriors_count: int):
        return self._send_command_to_engine('transport_food_operation', {
            'user_id': user_id,
            'performing_colony_id': performing_colony_id,
            'from_nest_id': from_nest_id,
            'to_nest_id': to_nest_id,
            'workers_count': workers_count,
            'warriors_count': warriors_count
        }, True)

    def build_fortification_operation_command(self, user_id: int, performing_colony_id: int, nest_id: int, workers_count: int):
        return self._send_command_to_engine('build_fortification_operation', {
            'user_id': user_id,
            'performing_colony_id': performing_colony_id,
            'nest_id': nest_id,
            'workers_count': workers_count
        }, True)
    
    def bring_bug_operation_command(self, user_id: int, performing_colony_id: int, nest_id: int):
        return self._send_command_to_engine('bring_bug_operation', {
            'user_id': user_id,
            'performing_colony_id': performing_colony_id,
            'nest_id': nest_id
        }, True)

    def add_egg_command(self, user_id: int, nest_id: int, name: str, is_fertilized: bool):
        return self._send_command_to_engine('add_egg', {
            'user_id': user_id,
            'name': name,
            'nest_id': nest_id,
            'is_fertilized': is_fertilized
        }, True)

    def change_egg_caste_command(self, user_id: int, nest_id: int, egg_id: str, ant_type: str):
        return self._send_command_to_engine('change_egg_caste', {
            'user_id': user_id,
            'nest_id': nest_id,
            'egg_id': egg_id,
            'ant_type': ant_type,
        }, True)

    def change_egg_name_command(self, user_id: int, nest_id: int, egg_id: str, name: str):
        return self._send_command_to_engine('change_egg_name', {
            'user_id': user_id,
            'nest_id': nest_id,
            'egg_id': egg_id,
            'name': name,
        }, True)

    def move_egg_to_larva_chamber_command(self, user_id: int, nest_id: int, egg_id: str):
        return self._send_command_to_engine('move_egg_to_larva_chamber', {
            'user_id': user_id,
            'nest_id': nest_id,
            'egg_id': egg_id
        }, True)

    def delete_egg_command(self, user_id: int, nest_id: int, egg_id: str):
        return self._send_command_to_engine('delete_egg', {
            'user_id': user_id,
            'nest_id': nest_id,
            'egg_id': egg_id
        }, True)

    def delete_larva_command(self, user_id: int, nest_id: int, larva_id: str):
        return self._send_command_to_engine('delete_larva', {
            'user_id': user_id,
            'nest_id': nest_id,
            'larva_id': larva_id
        }, True)

    def found_colony_command(self, user_id: int, queen_id: int, nuptial_male_id: int, nest_building_site: List[int], colony_name: str):
        return self._send_command_to_engine('found_colony', {
            'user_id': user_id,
            'queen_id': queen_id,
            'nuptial_male_id': nuptial_male_id,
            'nest_building_site': nest_building_site,
            'colony_name': colony_name
        }, True)

    def born_new_antara_command(self, user_id: int):
        return self._send_command_to_engine('born_new_antara', {
            'user_id': user_id
        }, True)

    def fly_nuptial_flight_command(self, user_id: int, ant_id: int):
        return self._send_command_to_engine('fly_nuptial_flight', {
            'user_id': user_id,
            'ant_id': ant_id
        }, True)

    def change_ant_guardian_behavior_command(self, user_id: int, ant_id: int, guaridan_behavior: str):
        return self._send_command_to_engine('change_ant_guardian_behavior', {
            'user_id': user_id,
            'ant_id': ant_id,
            'guaridan_behavior': guaridan_behavior,
        }, True)

    def change_ant_cooperative_behavior_command(self, user_id: int, ant_id: int, is_enabled: bool):
        return self._send_command_to_engine('change_ant_cooperative_behavior', {
            'user_id': user_id,
            'ant_id': ant_id,
            'is_enabled': is_enabled,
        }, True)

    def relocate_ant_command(self, user_id: int, ant_id: int, nest_id: int):
        return self._send_command_to_engine('relocate_ant', {
            'user_id': user_id,
            'ant_id': ant_id,
            'nest_id': nest_id,
        }, True)

    def change_specie_schema_command(self, user_id: int, specie_schema: Dict):
        return self._send_command_to_engine('change_specie_schema', {
            'user_id': user_id,
            'specie_schema': specie_schema,
        }, True)

    def rename_nest_command(self, user_id: int, nest_id: int, name: str):
        return self._send_command_to_engine('rename_nest', {
            'user_id': user_id,
            'name': name,
            'nest_id': nest_id
        }, True)

    # </PLAYER_COMMANDS>

    def get_world_status(self):
        status = self._redis.get('engine_status')
        is_world_inited = False
        is_world_stepping = False
        if status:
            status = json.loads(status)
            is_world_inited = status['is_world_inited']
            is_world_stepping = status['is_world_stepping']

        return {
            'is_world_inited': is_world_inited,
            'is_world_stepping': is_world_stepping
        }

    def _send_msg_to_engine(self, type: str, data: Dict = None):
        self._redis.publish(EngineFacade.CHANNEL_ENGINE_IN, json.dumps({
            'type': type,
            'data': data
        }))

    def _generate_command_id(self):
        self._last_used_command_id += 1
        return self._last_used_command_id

    def _send_command_to_engine(self, type: str, data: Dict, wait_result: bool, is_from_admin: bool = False):
        command_id = self._generate_command_id()
        if wait_result:
            command_future = Future()
            self._command_futures[command_id] = command_future
        self._send_msg_to_engine('command', {
            'id': command_id,
            'from': 'admin' if is_from_admin else 'player',
            'type': type,
            'data': data
        })
        if wait_result:
            try:
                res = command_future.result(EngineFacade.WAIT_COMMAND_RESULT_TIMEOUT)
                return res
            except TimeoutError as e:
                raise EngineResponseTimeoutError()
            finally:
                del self._command_futures[command_id]

    def _listen_engine_out(self):
        def listen():
            pubsub = self._redis.pubsub(ignore_subscribe_messages=True)
            pubsub.subscribe(EngineFacade.CHANNEL_ENGINE_OUT)
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

        world_thread = threading.Thread(target=listen, daemon=True)
        world_thread.start()

    def _on_init_step_data_pack_msg(self, data: Dict):
        data['players_data'] = {int(player_id): player_data for player_id, player_data in data['players_data'].items()}
        for player_id in data['players_data']:
            event_bus.emit(f'init_step_data_pack_ready:{player_id}', data)

    def _on_step_data_pack_msg(self, data: Dict):
        data['personal_actions'] = {int(player_id): actions for player_id, actions in data['personal_actions'].items()}
        event_bus.emit(f'step_data_pack_ready', data)
    
    def _on_command_result(self, data: Dict):
        command_id = data['command_id']
        if command_id in self._command_futures:
            future: Future = self._command_futures[command_id]
            future.set_result(data['result'])

    def _on_command_error(self, data: Dict):
        command_id = data['command_id']
        if command_id in self._command_futures:
            future: Future = self._command_futures[command_id]
            match (data['err_code']):
                case 'state_conflict_error':
                    future.set_exception(EngineStateConflictError(data['err_data']['step']))
                case _:
                    future.set_exception(EngineError())

    def _start_rating_generation_command_sender(self):
        def sender():
            while True:
                time.sleep(RATING_GENERATION_PERIOD)
                self._generate_rating_command()

        rating_gen_thread = threading.Thread(target=sender, daemon=True)
        rating_gen_thread.start()
