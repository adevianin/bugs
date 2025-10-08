from unittest.mock import MagicMock
import pytest, redis, pytest_asyncio, threading, asyncio
from decouple import config
from infrastructure.services.engine.engine_adapter import EngineAdapter
from core.application.engine import Engine

@pytest_asyncio.fixture
async def redis_client_engine_adapter():
    r = redis.asyncio.Redis(host=config('REDIS_HOST'), port=config('REDIS_PORT'), password=config('REDIS_PASSWORD', default=None), decode_responses=True)
    yield r
    await r.aclose()

@pytest.fixture
def redis_client_engine():
    r = redis.Redis(config('REDIS_HOST'), config('REDIS_PORT'), password=config('REDIS_PASSWORD', default=None), decode_responses=True)
    yield r
    r.close()

@pytest.fixture
def engine_adapter_factory(redis_client_engine_adapter):
    def create(world_data_repository=None, usernames_repository=None, event_bus=None):
        event_bus = event_bus or MagicMock()
        world_data_repository = world_data_repository or MagicMock()
        usernames_repository = usernames_repository or MagicMock()
        r = redis_client_engine_adapter
        world_backup_saver = MagicMock()
        logger = MagicMock()
        return EngineAdapter(event_bus, world_data_repository, usernames_repository, r, world_backup_saver, logger)
    return create

@pytest.fixture
def engine_factory(redis_client_engine):
    def create(
            colony_service=None,
            nuptial_environment_service=None,
            ant_service=None, 
            rating_service=None, 
            notification_service=None, 
            colony_relations_service=None, 
            ant_birther_service=None, 
            item_birther_service=None, 
            nest_birther_service=None, 
            ladybug_birther_service=None,
            ladybug_spawner_service=None, 
            bug_corpse_spawner_service=None, 
            vision_serivce=None, 
            thermal_service=None, 
            item_service=None,
            world_service=None,

            stats_client_serializer=None,
            genes_client_serializer=None,
            genome_client_serializer=None,
            larva_client_serializer=None,
            egg_client_serializer=None,
            util_client_serializer=None,
            operation_client_serializer=None,
            colony_client_serializer=None,
            item_client_serializer=None,
            item_source_client_serializer=None,
            item_area_client_serializer=None,
            nest_client_serializer=None,
            ant_client_serializer=None,
            tree_client_serializer=None,
            ladybug_client_serializer=None,
            common_entity_client_serializer=None,
            climate_client_serializer=None,
            world_client_serializer=None,
            death_record_client_serializer=None,
            notification_client_serializer=None,
            nuptial_environment_client_serializer=None,
            action_client_serializer=None,
            constants_client_serializer=None
        ):
        event_bus = MagicMock()
        r = redis_client_engine
        logger = MagicMock()
        services = {
            'colony_service': colony_service or MagicMock(),
            'nuptial_environment_service': nuptial_environment_service or MagicMock(),
            'ant_service': ant_service or MagicMock(), 
            'rating_service': rating_service or MagicMock(), 
            'notification_service': notification_service or MagicMock(), 
            'colony_relations_service': colony_relations_service or MagicMock(), 
            'ant_birther_service': ant_birther_service or MagicMock(), 
            'item_birther_service': item_birther_service or MagicMock(), 
            'nest_birther_service': nest_birther_service or MagicMock(), 
            'ladybug_birther_service': ladybug_birther_service or MagicMock(),
            'ladybug_spawner_service': ladybug_spawner_service or MagicMock(), 
            'bug_corpse_spawner_service': bug_corpse_spawner_service or MagicMock(), 
            'vision_serivce': vision_serivce or MagicMock(), 
            'thermal_service': thermal_service or MagicMock(), 
            'item_service': item_service or MagicMock(),
            'world_service': world_service or MagicMock()
        }
        client_serializers = {
            'stats_client_serializer': stats_client_serializer or MagicMock(),
            'genes_client_serializer': genes_client_serializer or MagicMock(),
            'genome_client_serializer': genome_client_serializer or MagicMock(),
            'larva_client_serializer': larva_client_serializer or MagicMock(),
            'egg_client_serializer': egg_client_serializer or MagicMock(),
            'util_client_serializer': util_client_serializer or MagicMock(),
            'operation_client_serializer': operation_client_serializer or MagicMock(),
            'colony_client_serializer': colony_client_serializer or MagicMock(),
            'item_client_serializer': item_client_serializer or MagicMock(),
            'item_source_client_serializer': item_source_client_serializer or MagicMock(),
            'item_area_client_serializer': item_area_client_serializer or MagicMock(),
            'nest_client_serializer': nest_client_serializer or MagicMock(),
            'ant_client_serializer': ant_client_serializer or MagicMock(),
            'tree_client_serializer': tree_client_serializer or MagicMock(),
            'ladybug_client_serializer': ladybug_client_serializer or MagicMock(),
            'common_entity_client_serializer': common_entity_client_serializer or MagicMock(),
            'climate_client_serializer': climate_client_serializer or MagicMock(),
            'world_client_serializer': world_client_serializer or MagicMock(),
            'death_record_client_serializer': death_record_client_serializer or MagicMock(),
            'notification_client_serializer': notification_client_serializer or MagicMock(),
            'nuptial_environment_client_serializer': nuptial_environment_client_serializer or MagicMock(),
            'action_client_serializer': action_client_serializer or MagicMock(),
            'constants_client_serializer': constants_client_serializer or MagicMock()
        }
        world_deserializer = MagicMock()
        world_serializer = MagicMock()
        return Engine(event_bus, r, logger, services, client_serializers, world_deserializer, world_serializer)
    return create

@pytest_asyncio.fixture
async def inited_engine_adapter_engine_environment(engine_adapter_factory, engine_factory):
    world = MagicMock()
    world.current_step = 1
    world.current_season = 'current_season'
    services = {
        'colony_service': MagicMock(),
        'nuptial_environment_service': MagicMock(),
        'ant_service': MagicMock(), 
        'rating_service': MagicMock(), 
        'notification_service': MagicMock(), 
        'colony_relations_service': MagicMock(), 
        'ant_birther_service': MagicMock(), 
        'item_birther_service': MagicMock(), 
        'nest_birther_service': MagicMock(), 
        'ladybug_birther_service': MagicMock(),
        'ladybug_spawner_service': MagicMock(), 
        'bug_corpse_spawner_service': MagicMock(), 
        'vision_serivce': MagicMock(), 
        'thermal_service': MagicMock(), 
        'item_service': MagicMock(),
        'world_service': MagicMock()
    }
    serializers = {
        'stats_client_serializer':  MagicMock(),
        'genes_client_serializer': MagicMock(),
        'genome_client_serializer': MagicMock(),
        'larva_client_serializer': MagicMock(),
        'egg_client_serializer': MagicMock(),
        'util_client_serializer': MagicMock(),
        'operation_client_serializer': MagicMock(),
        'colony_client_serializer': MagicMock(),
        'item_client_serializer': MagicMock(),
        'item_source_client_serializer': MagicMock(),
        'item_area_client_serializer': MagicMock(),
        'nest_client_serializer': MagicMock(),
        'ant_client_serializer': MagicMock(),
        'tree_client_serializer': MagicMock(),
        'ladybug_client_serializer': MagicMock(),
        'common_entity_client_serializer': MagicMock(),
        'climate_client_serializer': MagicMock(),
        'world_client_serializer': MagicMock(),
        'death_record_client_serializer': MagicMock(),
        'notification_client_serializer': MagicMock(),
        'nuptial_environment_client_serializer': MagicMock(),
        'action_client_serializer': MagicMock(),
        'constants_client_serializer': MagicMock()
    }
    services['world_service'].build_new_empty_world.return_value = world
    engine_factory_params = {}
    engine_factory_params.update(services)
    engine_factory_params.update(serializers)
    engine = engine_factory(**engine_factory_params)
    engine_thread = threading.Thread(target=engine.start, daemon=True)
    engine_thread.start()

    world_data_repository = MagicMock()
    world_data_repository.get.return_value = None
    usernames_repository = MagicMock()
    usernames_repository.get_usernames.return_value = []
    engine_adapter_event_bus = MagicMock()
    engine_adapter = engine_adapter_factory(
        world_data_repository=world_data_repository,
        usernames_repository=usernames_repository,
        event_bus=engine_adapter_event_bus
    )
    engine_adapter.start_listening_engine()

    #mocking generating init package
    services['notification_service'].find_notifications_for_owner.return_value = []
    services['rating_service'].rating = []
    serializers['world_client_serializer'].serialize.return_value = 'serialized_world'
    serializers['nuptial_environment_client_serializer'].serialize_specie.return_value = 'serialized_specie'
    serializers['nuptial_environment_client_serializer'].serialize_nuptial_males.return_value = 'serialized_nuptial_males'
    serializers['constants_client_serializer'].serialize_constants.return_value = {}

    await asyncio.sleep(0.05)

    await engine_adapter.init_world_admin_command()

    engine_pack = {
        'engine': engine, 
        'services': services, 
        'serializers': serializers
    }

    engine_adapter_pack = {
        'engine_adapter': engine_adapter,
        'event_bus': engine_adapter_event_bus
    }

    yield engine_adapter_pack, engine_pack
    
    engine.stop()
