from core.world.utils.event_emiter import EventEmitter

from core.world.services.notification_serivce import NotificationService
from core.world.services.colony_relations_service import ColonyRelationsService
from core.world.services.birthers.ant_birther_service import AntBirtherService
from core.world.services.birthers.item_birther_service import ItemBirtherService
from core.world.services.birthers.nest_birther_service import NestBirtherService
from core.world.services.birthers.ladybug_birther_service import LadybugBirtherService
from core.world.services.spawners.ladybug_spawner_service import LadybugSpawnerService
from core.world.services.spawners.bug_corpse_spawner_service import BugCorpseSpawnerService
from core.world.services.vision_service import VisionService
from core.world.services.thermal_service import ThermalService
from core.world.services.rating_serivice import RatingService
from core.world.services.world_service import WorldService
from core.world.services.ant_service import AntService
from core.world.services.colony_service import ColonyService
from core.world.services.nuptial_service import NuptialService

from core.deserializers.world_deserializer import WorldDeserializer
from core.serializers.world_serializer import WorldSerializer

from core.client_serializers.world_client_serializer import WorldClientSerializer
from core.client_serializers.action_client_serializer import ActionClientSerializer
from core.client_serializers.nuptial_environment_client_serializer import NuptialEnvironmentClientSerializer
from core.client_serializers.constants_client_serializer import ConstantsClientSerializer
from core.client_serializers.notification_client_serializer import NotificationClientSerializer
from core.client_serializers.egg_client_serializer import EggClientSerializer
from core.client_serializers.larva_client_serializer import LarvaClientSerializer

from logging import Logger
from core.world.entities.world.world import World
from core.world.entities.world.id_generator import IdGenerator
from core.world.settings import STEP_TIME
import time, threading, redis, json
from multiprocessing import SimpleQueue
from core.world.exceptions import GameError, StateConflictError
from core.world.entities.action.base.action import Action
from typing import Dict, List
from bugs.settings import DEBUG
from core.world.utils.clean_name import clean_name
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes
from core.world.utils.point import Point
from core.world.entities.ant.base.guardian_behaviors import GuardianBehaviors
from core.world.entities.ant.base.ant_types import AntTypes

class Engine():

    NEW_WORLD_CHUNKS_HORIZONTAL = 4
    NEW_WORLD_CHUNKS_VERTICAL = 4

    CHANNEL_ENGINE_IN = 'engine_in'
    CHANNEL_ENGINE_OUT = 'engine_out'

    def __init__(self, event_bus: EventEmitter, redis: redis.Redis, logger: Logger, services, client_serializers, world_deserializer: WorldDeserializer, world_serializer: WorldSerializer):
        self._init_services(services)
        self._init_client_serializers(client_serializers)
        self._event_bus = event_bus
        self._redis = redis
        self._player_connect_q = SimpleQueue()
        self._player_disconnect_q = SimpleQueue()
        self._player_commands_q = SimpleQueue()
        self._admin_commands_q = SimpleQueue()
        self._logger = logger
        self._world_deserializer = world_deserializer
        self._world_serializer = world_serializer
        self._world = None
        self._is_world_inited = False
        self._is_world_stepping = False
        self._connected_player_ids = []
        self._common_actions = []
        self._personal_actions = {}

        self._event_bus.add_listener('action', self._on_action)

    def start(self):
        self._logger.info('engine start')
        self._listen_engine_in()
        self._run_game_loop()

    def _init_services(self, services):
        self._colony_service: ColonyService = services['colony_service']
        self._nuptial_environment_service: NuptialService = services['nuptial_environment_service']
        self._ant_service: AntService = services['ant_service']
        self._rating_service: RatingService = services['rating_service']
        self._notification_service: NotificationService = services['notification_service']
        self._colony_relations_service: ColonyRelationsService = services['colony_relations_service']
        self._ant_birther_service: AntBirtherService = services['ant_birther_service']
        self._item_birther_service: ItemBirtherService = services['item_birther_service']
        self._nest_birther_service: NestBirtherService = services['nest_birther_service']
        self._ladybug_birther_service: LadybugBirtherService = services['ladybug_birther_service']
        self._ladybug_spawner_service: LadybugSpawnerService = services['ladybug_spawner_service']
        self._bug_corpse_spawner_service: BugCorpseSpawnerService = services['bug_corpse_spawner_service']
        self._vision_service: VisionService = services['vision_serivce']
        self._thermal_service: ThermalService = services['thermal_service']
        self._world_service: WorldService = services['world_service']

    def _init_client_serializers(self, serializers):
        self._world_client_serializer: WorldClientSerializer = serializers['world_client_serializer']
        self._nuptial_environment_client_serializer: NuptialEnvironmentClientSerializer = serializers['nuptial_environment_client_serializer']
        self._consts_client_serializer: ConstantsClientSerializer = serializers['constants_client_serializer']
        self._notification_client_serializer: NotificationClientSerializer = serializers['notification_client_serializer']
        self._action_client_serializer: ActionClientSerializer = serializers['action_client_serializer']
        self._egg_client_serializer: EggClientSerializer = serializers['egg_client_serializer']
        self._larva_client_serializer: LarvaClientSerializer = serializers['larva_client_serializer']

    def _setup_services(self):
        self._logger.info('setting up services')
        self._colony_service.set_world(self._world)
        self._nuptial_environment_service.set_world(self._world)
        self._ant_service.set_world(self._world)
        self._rating_service.set_world(self._world)
        self._notification_service.set_world(self._world)
        self._colony_relations_service.set_world(self._world)
        self._ant_birther_service.set_world(self._world)
        self._item_birther_service.set_world(self._world)
        self._nest_birther_service.set_world(self._world)
        self._ladybug_birther_service.set_world(self._world)
        self._ladybug_spawner_service.set_world(self._world)
        self._bug_corpse_spawner_service.set_world(self._world)
        self._vision_service.set_world(self._world)
        self._thermal_service.set_world(self._world)
        self._world_service.set_world(self._world)

    def _listen_engine_in(self):
        self._logger.info('listening main connection')
        def listen():
            pubsub = self._redis.pubsub(ignore_subscribe_messages=True)
            pubsub.subscribe(Engine.CHANNEL_ENGINE_IN)
            for msg in pubsub.listen():
                msg_data_json = json.loads(msg['data'])
                self._on_client_msg(msg_data_json)

        world_thread = threading.Thread(target=listen, daemon=True)
        world_thread.start()

    def _run_game_loop(self):
        self._logger.info('running game loop')

        while True:
            self._handle_admin_commands()

            if self._is_world_inited:
                iteration_start = time.time()
                step_number = self._world.current_step

                self._logger.info(f'step start: { step_number }')

                try:
                    self._handle_player_disconnections()
                    if self._is_world_stepping:
                        self._world.do_step()
                        self._send_step_data_pack()
                        self._handle_player_connections()
                        self._handle_player_commands()
                except Exception as e:
                    self._logger.exception(f'game loop iteration error. step={step_number}', exc_info=e)
                    if DEBUG:
                        raise e
                
                iteration_end = time.time()
                iteration_time = iteration_end - iteration_start

                if iteration_time > STEP_TIME:
                    self._logger.warning(f'step took too long: {iteration_time}')

                self._update_engine_status()

                self._logger.info(f'step time: { iteration_time }')
                self._logger.info(f'step done: { step_number }')

                if (STEP_TIME - iteration_time > 0):
                    time.sleep(STEP_TIME - iteration_time)
            else:
                self._logger.info('waiting init command...')
                time.sleep(1)

    def _update_engine_status(self):
        self._redis.set('engine_status', json.dumps({
            'is_world_inited': self._is_world_inited,
            'is_world_stepping': self._is_world_stepping
        }), STEP_TIME + 3)

    def _handle_player_disconnections(self):
        while not self._player_disconnect_q.empty():
            player_disconnect_msg = self._player_disconnect_q.get()
            if player_disconnect_msg['player_id'] in self._connected_player_ids:
                self._connected_player_ids.remove(player_disconnect_msg['player_id'])

    def _handle_player_connections(self):
        new_connected_ids = self._handle_player_connect_q()
        if len(new_connected_ids) > 0:
            msg_data = self._build_init_step_data_pack(new_connected_ids)
            self._send_msg('init_step_data_pack', msg_data)

    def _handle_player_connect_q(self):
        new_connected_ids = []
        while not self._player_connect_q.empty():
            player_connect_msg = self._player_connect_q.get()
            id = player_connect_msg['player_id']
            self._connected_player_ids.append(id)
            new_connected_ids.append(id)
            self._nuptial_environment_service.ensure_nuptial_env_built_for_player(id)
        
        return new_connected_ids

    def _build_init_step_data_pack(self, new_connected_ids: List[int]):
        serialized_world = self._world_client_serializer.serialize(self._world)
        players_data = {}
        for player_id in new_connected_ids:
            specie = self._nuptial_environment_service.get_specie_for(player_id)
            nuptial_males = self._nuptial_environment_service.get_nuptial_males_for_owner(player_id)
            notifications = self._notification_service.find_notifications_for_owner(player_id)
            init_step_data = {
                'specie': self._nuptial_environment_client_serializer.serialize_specie(specie),
                'nuptial_males': self._nuptial_environment_client_serializer.serialize_nuptial_males(nuptial_males),
                'notifications': [self._notification_client_serializer.serialize(notification) for notification in notifications],
            }
            players_data[player_id] = init_step_data

        return {
            'world': serialized_world,
            'step': self._world.current_step,
            'season': self._world.current_season,
            'rating': self._rating_service.rating,
            'consts': self._consts_client_serializer.serialize_constants(),
            'players_data': players_data
        }

    def _send_step_data_pack(self):
        serialized_common_actions, serialized_personal_actions = self._handle_step_actions()
        msg_data = {
            'step': self._world.current_step,
            'season': self._world.current_season,
            'common_actions': serialized_common_actions,
            'personal_actions': serialized_personal_actions
        }
        self._send_msg('step_data_pack', msg_data)

    def _handle_step_actions(self):
        serialized_common_actions = [self._action_client_serializer.serialize(action) for action in self._common_actions]
        serialized_personal_actions = {}
        for player_id in self._personal_actions:
            personal_actions_pack = self._personal_actions[player_id]
            serialized_personal_actions[player_id] = [self._action_client_serializer.serialize(action) for action in personal_actions_pack]

        self._personal_actions = {}
        self._common_actions = []
        return (serialized_common_actions, serialized_personal_actions)

    def _on_action(self, action: Action):
        if action.is_personal():
            player_id = action.for_user_id
            if player_id in self._connected_player_ids:
                personal_actions_pack: List = self._personal_actions.get(player_id, [])
                personal_actions_pack.append(action)
                self._personal_actions[player_id] = personal_actions_pack
        else:
            self._common_actions.append(action)

    def _on_command(self, data: Dict):
        match (data['from']):
            case 'admin':
                self._admin_commands_q.put(data)
            case 'player':
                self._player_commands_q.put(data)
            case _:
                raise GameError('unknown command sender')
            
    def _on_client_msg(self, msg: Dict):
        # if not self._is_world_stepping and msg['type'] != 'start_world_stepping':
        #     self._logger.warning('message not accepted world is not stepping')
        #     return
        
        data = msg['data']
        match (msg['type']):
            case 'player_connect_request':
                self._player_connect_q.put(data)
            case 'player_disconect_request':
                self._player_disconnect_q.put(data)
            case 'command':
                self._on_command(data)
            case _:
                raise GameError('unknown msg type')
            
    def _send_msg(self, type: str, data: Dict):
        self._redis.publish(Engine.CHANNEL_ENGINE_OUT, json.dumps({
            'type': type,
            'data': data
        }))

    def _send_command_result(self, command_id: int, result):
        self._send_msg('command_result', {
            'command_id': command_id,
            'result': result,
        })

    def _send_command_error(self, command_id: int, err_code: str, err_data: Dict = None):
        self._send_msg('command_error', {
            'command_id': command_id,
            'err_code': err_code,
            'err_data': err_data
        })

    def _handle_admin_commands(self):
        while not self._admin_commands_q.empty():
            command = self._admin_commands_q.get()
            command_id = command['id']
            try:
                match (command['type']):
                    case 'init_world':
                        self._handle_init_world_admin_command(command)
                    case 'start_world_stepping':
                        self._is_world_stepping = True
                        self._update_engine_status()
                        self._send_command_result(command_id, True)
                    case 'stop_world_stepping':
                        self._is_world_stepping = False
                        self._update_engine_status()
                        self._send_command_result(command_id, False)
                    case 'get_world_state':
                        world_state = self._world_serializer.serialize(self._world)
                        self._send_command_result(command_id, world_state)
                    case 'expand_map':
                        data = command['data']
                        self._world_service.expand_current_map(data['chunk_rows'], data['chunk_cols'])
                        self._send_command_result(command_id, True)
                    case 'generate_rating':
                        if self._is_world_inited:
                            self._rating_service.generate_rating(command['data'])
                    case _:
                        raise GameError('unknown admin command type')
            except Exception as e:
                self._logger.exception('admin command error', exc_info=e)
                self._send_command_error(command_id, 'admin_command_error')
    
    def _handle_init_world_admin_command(self, command: Dict):
        if self._is_world_inited:
            self._logger.warning('world is already inited')
            return
        
        data = command['data']
        world_json = data['world_data']
        if world_json:
            self._world = self._world_deserializer.deserialize(world_json)
            IdGenerator.set_global_generator(self._world.id_generator)
        else:
            self._world = self._world_service.build_new_empty_world(Engine.NEW_WORLD_CHUNKS_HORIZONTAL, Engine.NEW_WORLD_CHUNKS_VERTICAL)
            IdGenerator.set_global_generator(self._world.id_generator)
            self._world_service.populate_empty_world(self._world)

        self._setup_services()

        users_data = data['users_data']
        self._rating_service.generate_rating(users_data)

        self._is_world_inited = True
        self._update_engine_status()
        self._send_command_result(command['id'], True)

    def _handle_player_commands(self):
        while not self._player_commands_q.empty():
            command = self._player_commands_q.get()
            command_id = command['id']
            try:
                match (command['type']):
                    case 'add_egg':
                        self._handle_add_egg_command(command)
                    case 'rename_nest':
                        self._handle_rename_nest_command(command)
                    case 'change_specie_schema':
                        self._handle_change_specie_schema_command(command)
                    case 'stop_operation':
                        self._handle_stop_operation_command(command)
                    case 'build_new_sub_nest_operation':
                        self._handle_build_new_sub_nest_operation_command(command)
                    case 'destroy_nest_operation':
                        self._handle_destroy_nest_operation_command(command)
                    case 'pillage_nest_operation':
                        self._handle_pillage_nest_operation_command(command)
                    case 'transport_food_operation':
                        self._handle_transport_food_operation_command(command)
                    case 'build_fortification_operation':
                        self._handle_build_fortification_operation_command(command)
                    case 'bring_bug_operation':
                        self._handle_bring_bug_operation_command(command)
                    case 'relocate_ant':
                        self._handle_relocate_ant_command(command)
                    case 'change_ant_cooperative_behavior':
                        self._handle_change_ant_cooperative_behavior_command(command)
                    case 'change_ant_guardian_behavior':
                        self._handle_change_ant_guardian_behavior_command(command)
                    case 'fly_nuptial_flight':
                        self._handle_fly_nuptial_flight_command(command)
                    case 'change_egg_caste':
                        self._handle_change_egg_caste_command(command)
                    case 'change_egg_name':
                        self._handle_change_egg_name_command(command)
                    case 'move_egg_to_larva_chamber':
                        self._handle_move_egg_to_larva_chamber_command(command)
                    case 'delete_egg':
                        self._handle_delete_egg_command(command)
                    case 'delete_larva':
                        self._handle_delete_larva_command(command)
                    case 'found_colony':
                        self._handle_found_colony_command(command)
                    case 'born_new_antara':
                        self._handle_born_new_antara_command(command)
                    case _:
                        raise GameError(f'unknown player command type "{command['type']}"')
            except StateConflictError as e:
                self._logger.exception('player command error', exc_info=e)
                self._send_command_error(command_id, 'state_conflict_error', {
                    'step': e.step
                })
            except Exception as e:
                self._logger.exception('player command error', exc_info=e)
                self._send_command_error(command_id, 'player_command_error')

    def _handle_born_new_antara_command(self, command: Dict):
        data = command['data']
        self._nuptial_environment_service.born_new_antara(data['user_id'])
        self._send_command_result(command['id'], True)

    def _handle_found_colony_command(self, command: Dict):
        data = command['data']
        nest_building_site = Point.from_json(data['nest_building_site'])
        colony_name = clean_name(data['colony_name'])
        self._colony_service.found_new_colony(data['user_id'], data['queen_id'], data['nuptial_male_id'], nest_building_site, colony_name)
        self._send_command_result(command['id'], True)

    def _handle_delete_larva_command(self, command: Dict):
        data = command['data']
        self._colony_service.delete_larva(data['user_id'], data['nest_id'], data['larva_id'])
        self._send_command_result(command['id'], True)

    def _handle_delete_egg_command(self, command: Dict):
        data = command['data']
        self._colony_service.delete_egg(data['user_id'], data['nest_id'], data['egg_id'])
        self._send_command_result(command['id'], True)

    def _handle_move_egg_to_larva_chamber_command(self, command: Dict):
        data = command['data']
        larva = self._colony_service.move_egg_to_larva_chamber(data['user_id'], data['nest_id'], data['egg_id'])
        serialized_larva = self._larva_client_serializer.serialize(larva)
        self._send_command_result(command['id'], serialized_larva)

    def _handle_change_egg_name_command(self, command: Dict):
        data = command['data']
        name = clean_name(data['name'])
        self._colony_service.change_egg_name(data['user_id'], data['nest_id'], data['egg_id'], name)
        self._send_command_result(command['id'], True)

    def _handle_change_egg_caste_command(self, command: Dict):
        data = command['data']
        ant_type = AntTypes(data['ant_type'])
        self._colony_service.change_egg_caste(data['user_id'], data['nest_id'], data['egg_id'], ant_type)
        self._send_command_result(command['id'], True)

    def _handle_fly_nuptial_flight_command(self, command: Dict):
        data = command['data']
        self._ant_service.fly_nuptial_flight(data['user_id'], data['ant_id'])
        self._send_command_result(command['id'], True)

    def _handle_change_ant_guardian_behavior_command(self, command: Dict):
        data = command['data']
        guaridan_behavior = GuardianBehaviors(data['guaridan_behavior'])
        self._ant_service.change_ant_guardian_behavior(data['user_id'], data['ant_id'], guaridan_behavior)
        self._send_command_result(command['id'], True)

    def _handle_change_ant_cooperative_behavior_command(self, command: Dict):
        data = command['data']
        self._ant_service.change_ant_cooperative_behavior(data['user_id'], data['ant_id'], data['is_enabled'])
        self._send_command_result(command['id'], True)

    def _handle_relocate_ant_command(self, command: Dict):
        data = command['data']
        self._ant_service.relocate_ant(data['user_id'], data['ant_id'], data['nest_id'])
        self._send_command_result(command['id'], True)

    def _handle_add_egg_command(self, command: Dict):
        data = command['data']
        egg = self._colony_service.add_egg(data['user_id'], data['nest_id'], clean_name(data['name']), data['is_fertilized'])
        serialized_egg = self._egg_client_serializer.serialize_egg(egg)
        self._send_command_result(command['id'], serialized_egg)

    def _handle_rename_nest_command(self, command: Dict):
        data = command['data']
        self._colony_service.rename_nest(data['user_id'], data['nest_id'], clean_name(data['name']))
        self._send_command_result(command['id'], True)

    def _handle_change_specie_schema_command(self, command: Dict):
        data = command['data']
        specie_schema = {}
        for chromosome_type in data['specie_schema']:
            type = ChromosomeTypes(chromosome_type)
            ids = data['specie_schema'][chromosome_type]
            specie_schema[type] = ids
        self._nuptial_environment_service.change_specie_schema(data['user_id'], specie_schema)
        self._send_command_result(command['id'], True)

    def _handle_stop_operation_command(self, command: Dict):
        data = command['data']
        self._colony_service.stop_operation(data['user_id'], data['colony_id'], data['operation_id'])
        self._send_command_result(command['id'], True)

    def _handle_build_new_sub_nest_operation_command(self, command: Dict):
        data = command['data']
        building_site = Point.from_json(data['building_site'])
        nest_name = clean_name(data['nest_name'])
        self._colony_service.build_new_sub_nest(data['user_id'], data['performing_colony_id'], building_site, data['workers_count'], data['warriors_count'], nest_name)
        self._send_command_result(command['id'], True)

    def _handle_destroy_nest_operation_command(self, command: Dict):
        data = command['data']
        self._colony_service.destroy_nest_operation(data['user_id'], data['performing_colony_id'], data['nest_id'], data['workers_count'], data['warriors_count'])
        self._send_command_result(command['id'], True)

    def _handle_pillage_nest_operation_command(self, command: Dict):
        data = command['data']
        self._colony_service.pillage_nest_operation(data['user_id'], data['performing_colony_id'], data['nest_to_pillage_id'], data['nest_for_loot_id'], data['workers_count'], data['warriors_count'])
        self._send_command_result(command['id'], True)

    def _handle_transport_food_operation_command(self, command: Dict):
        data = command['data']
        self._colony_service.transport_food_operation(data['user_id'], data['performing_colony_id'], data['from_nest_id'], data['to_nest_id'], data['workers_count'], data['warriors_count'])
        self._send_command_result(command['id'], True)

    def _handle_build_fortification_operation_command(self, command: Dict):
        data = command['data']
        self._colony_service.build_fortification_operation(data['user_id'], data['performing_colony_id'], data['nest_id'], data['workers_count'])
        self._send_command_result(command['id'], True)

    def _handle_bring_bug_operation_command(self, command: Dict):
        data = command['data']
        self._colony_service.bring_bug_operation(data['user_id'], data['performing_colony_id'], data['nest_id'])
        self._send_command_result(command['id'], True)
