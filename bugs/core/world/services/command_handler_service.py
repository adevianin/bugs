from .town_service import TownService

class CommandHandlerService():

    def __init__(self, town_service: TownService):
        self._town_service = town_service

    def handleCommand(self, command_json, user_id):
        match command_json['command_type']:
            case 'add_larva':
                params = command_json['params']
                self._town_service.add_larva(params['town_id'], user_id, params['larva_type'])
            case _:
                raise Exception('unknown type of command')