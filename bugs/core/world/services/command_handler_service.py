from .town_service import TownService
from .operation_service import OperationService
from core.world.utils.point import Point

class CommandHandlerService():

    def __init__(self, town_service: TownService, operation_service: OperationService):
        self._town_service = town_service
        self._operation_service = operation_service

    def handle_command(self, command_json, user_id):
        params = command_json['params']
        match command_json['command_type']:
            case 'add_larva':
                self._town_service.add_larva(params['town_id'], user_id, params['larva_type'])
            case 'build_new_town':
                self._operation_service.build_new_town(user_id, Point(params['position']['x'], params['position']['y']))
            case _:
                raise Exception('unknown type of command')