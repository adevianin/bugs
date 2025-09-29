from .account_service import AccountService
from .email_service import EmailService
from .engine.engine_adapter import EngineAdapter
from infrastructure.event_bus import event_bus

_instances = {}

def get_email_service() -> EmailService:
    name = 'email_service'
    if name not in _instances:
        _instances[name] = EmailService()
    return _instances[name]

def get_account_service() -> AccountService:
    name = 'account_service'
    if name not in _instances:
        email_service = get_email_service()
        _instances[name] = AccountService(event_bus, email_service)
    return _instances[name]

def register_engine_adapter(ea: EngineAdapter):
    _instances['engine_adapter'] = ea

def get_engine_adapter() -> EngineAdapter:
    return _instances['engine_adapter']
