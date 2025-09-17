from infrastructure.db.repositories.world_data_repository import WorldDataRepository
from infrastructure.db.repositories.usernames_repository import UsernamesRepository
from infrastructure.engine.engine_adapter import EngineAdapter
import redis
from decouple import config

def init():
    world_data_repository = WorldDataRepository()
    usernames_repository = UsernamesRepository()

    r = redis.Redis(config('REDIS_HOST'), config('REDIS_PORT'), password=config('REDIS_PASSWORD'), decode_responses=True)

    EngineAdapter(world_data_repository, usernames_repository, r)
