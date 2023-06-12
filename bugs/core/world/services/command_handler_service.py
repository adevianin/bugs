from .nest_service import NestService
from .operation_service import OperationService
from core.world.utils.point import Point

class CommandHandlerService():

    def __init__(self, nest_service: NestService, operation_service: OperationService):
        self._nest_service = nest_service
        self._operation_service = operation_service

    def handle_command(self, command_json, user_id):
        params = command_json['params']
        match command_json['command_type']:
            case 'add_larva':
                self._nest_service.add_larva(params['nest_id'], user_id, params['larva_type'])
            case 'build_new_nest':
                self._operation_service.build_new_nest(user_id, Point(params['position']['x'], params['position']['y']))
            case _:
                raise Exception('unknown type of command')