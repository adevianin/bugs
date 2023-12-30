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
    
    def receive(self, text_data=None, bytes_data=None):
        msg = json.loads(text_data)

        match msg['type']:
            case 'command':
                self._handle_command(msg['command'], self._user.id)
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

    def _handle_command(self, command_json, user_id):
        params = command_json['params']
        match command_json['command_type']:
            case 'add_larva':
                self._world_facade.add_larva_command(user_id, params['nest_id'], params['larva_type'])
            case 'stop_operation':
                self._world_facade.stop_operation_command(user_id, params['colony_id'], params['operation_id'])
            case 'build_new_sub_nest':
                building_site = [params['building_site']['x'], params['building_site']['y']]
                performing_colony_id = params['performing_colony_id']
                workers_count = params['workers_count']
                self._world_facade.build_new_sub_nest_operation_command(user_id, performing_colony_id, building_site, workers_count)
            case 'destroy_nest':
                performing_colony_id = params['performing_colony_id']
                nest_id = params['nest_id']
                warriors_count = params['warriors_count']
                self._world_facade.destroy_nest_operation_command(user_id, performing_colony_id, nest_id, warriors_count)
            case 'pillage_nest':
                performing_colony_id = params['performing_colony_id']
                nest_to_pillage_id = params['nest_to_pillage_id']
                nest_for_loot_id = params['nest_for_loot_id']
                warriors_count = params['warriors_count']
                workers_count = params['workers_count']
                self._world_facade.pillage_nest_operation_command(user_id, performing_colony_id, nest_to_pillage_id, nest_for_loot_id, workers_count, warriors_count)
            case 'fly_nuptial_flight':
                ant_id = params['ant_id']
                self._world_facade.fly_nuptian_flight_command(user_id, ant_id)
            case _:
                raise Exception('unknown type of command')
    