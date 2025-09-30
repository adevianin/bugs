from infrastructure.db.repositories.world_data_repository import WorldDataRepository
from infrastructure.db.repositories.usernames_repository import UsernamesRepository
from infrastructure.services.engine.engine_adapter import EngineAdapter
import redis, logging
from decouple import config
from infrastructure.event_bus import register_event_bus, EventBus
from infrastructure.services.providers import register_engine_adapter, register_account_service, register_email_service, register_player_command_handler
from infrastructure.services.email_service import EmailService
from infrastructure.services.account_service import AccountService
from infrastructure.services.player_command_handler import PlayerCommandHandler
from infrastructure.services.world_backup_saver import WorldBackupSaver


def init():
    event_bus = EventBus()

    logger = logging.getLogger('django_logger')

    world_data_repository = WorldDataRepository()
    usernames_repository = UsernamesRepository()

    r = redis.Redis(config('REDIS_HOST'), config('REDIS_PORT'), password=config('REDIS_PASSWORD'), decode_responses=True)

    world_backup_saver = WorldBackupSaver()
    ea = EngineAdapter(event_bus, world_data_repository, usernames_repository, r, world_backup_saver, logger)
    email_service = EmailService()
    account_service = AccountService(event_bus, email_service)
    player_command_handler = PlayerCommandHandler(ea, logger)

    register_event_bus(event_bus)

    register_engine_adapter(ea)
    register_email_service(email_service)
    register_account_service(account_service)
    register_player_command_handler(player_command_handler)