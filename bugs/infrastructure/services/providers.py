from .account_service import AccountService
from .email_service import EmailService
from .engine.engine_adapter import EngineAdapter
from .player_command_handler import PlayerCommandHandler

_instances = {}

def register_email_service(es: EmailService):
    _instances['email_service'] = es

def get_email_service() -> EmailService:
    return _instances['email_service']

def register_account_service(account_service: AccountService):
    _instances['account_service'] = account_service

def get_account_service() -> AccountService:
    return _instances['account_service']

def register_engine_adapter(ea: EngineAdapter):
    _instances['engine_adapter'] = ea

def get_engine_adapter() -> EngineAdapter:
    return _instances.get('engine_adapter', None)

def register_player_command_handler(pch: PlayerCommandHandler):
    _instances['player_command_handler'] = pch

def get_player_command_handler() -> PlayerCommandHandler:
    return _instances['player_command_handler']
