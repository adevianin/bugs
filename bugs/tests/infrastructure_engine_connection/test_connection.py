from unittest.mock import MagicMock
import pytest, asyncio
from core.world.utils.point import Point

@pytest.mark.asyncio
async def test_init_world(inited_engine_adapter_engine_environment):
    engine_adapter_pack, engine_pack = inited_engine_adapter_engine_environment
    engine_adapter = engine_adapter_pack['engine_adapter']

    status = await engine_adapter.get_world_status()

    assert status['is_world_inited'] == True

@pytest.mark.asyncio
async def test_run_world(inited_engine_adapter_engine_environment):
    engine_adapter_pack, engine_pack = inited_engine_adapter_engine_environment
    engine_adapter = engine_adapter_pack['engine_adapter']

    await engine_adapter.run_world_admin_command()
    status = await engine_adapter.get_world_status()

    assert status['is_world_inited'] == True
    assert status['is_world_stepping'] == True

@pytest.mark.asyncio
async def test_player_connect_disconnect(inited_engine_adapter_engine_environment):
    engine_adapter_pack, engine_pack = inited_engine_adapter_engine_environment
    engine_adapter = engine_adapter_pack['engine_adapter']

    player_id = 23
    player_init_pack_event = asyncio.Event()

    def connect_event_handler(name, data=None):
        if name == f'init_step_data_pack_ready:{player_id}':
            player_init_pack_event.set()
    engine_adapter_pack['event_bus'].emit.side_effect = connect_event_handler

    await engine_adapter.run_world_admin_command()

    status = await engine_adapter.get_world_status()
    online_count_before_connect = status['players_online']

    await engine_adapter.connect_player(player_id)

    await asyncio.wait_for(player_init_pack_event.wait(), 3)
    await asyncio.sleep(1) # wait for engine status update

    status = await engine_adapter.get_world_status()
    online_count_after_connect = status['players_online']
    
    await engine_adapter.disconnect_player(player_id)

    await asyncio.sleep(4) # wait disconnecting and engine status update

    status = await engine_adapter.get_world_status()
    online_count_after_disconnect = status['players_online']

    assert online_count_after_connect - online_count_before_connect == 1
    assert online_count_after_disconnect == online_count_before_connect

@pytest.mark.asyncio
async def test_destroy_nest_operation_player_command(inited_engine_adapter_engine_environment):
    engine_adapter_pack, engine_pack = inited_engine_adapter_engine_environment
    engine_adapter = engine_adapter_pack['engine_adapter']

    operation = MagicMock()
    operation.id = 123
    engine_pack['services']['colony_service'].destroy_nest_operation.return_value = operation
 
    await engine_adapter.run_world_admin_command()

    user_id = 12
    performing_colony_id = 13
    nest_id = 33
    workers_count = 2
    warriors_count = 1
    actual_operation_id = await engine_adapter.destroy_nest_operation_command(user_id, performing_colony_id, nest_id, workers_count, warriors_count)

    engine_pack['services']['colony_service'].destroy_nest_operation.assert_called_once_with(user_id, performing_colony_id, nest_id, workers_count, warriors_count)
    assert operation.id == actual_operation_id

@pytest.mark.asyncio
async def test_pillage_nest_operation_player_command(inited_engine_adapter_engine_environment):
    engine_adapter_pack, engine_pack = inited_engine_adapter_engine_environment
    engine_adapter = engine_adapter_pack['engine_adapter']

    operation = MagicMock()
    operation.id = 123
    engine_pack['services']['colony_service'].pillage_nest_operation.return_value = operation
 
    await engine_adapter.run_world_admin_command()

    user_id = 12
    performing_colony_id = 13
    nest_to_pillage_id = 33
    nest_for_loot_id = 47
    workers_count = 2
    warriors_count = 1
    actual_operation_id = await engine_adapter.pillage_nest_operation_command(user_id, performing_colony_id, nest_to_pillage_id, nest_for_loot_id, workers_count, warriors_count)

    engine_pack['services']['colony_service'].pillage_nest_operation.assert_called_once_with(user_id, performing_colony_id, nest_to_pillage_id, nest_for_loot_id, workers_count, warriors_count)
    assert operation.id == actual_operation_id

@pytest.mark.asyncio
async def test_born_new_antara_player_command(inited_engine_adapter_engine_environment):
    engine_adapter_pack, engine_pack = inited_engine_adapter_engine_environment
    engine_adapter = engine_adapter_pack['engine_adapter']

    await engine_adapter.run_world_admin_command()

    user_id = 12
    await engine_adapter.born_new_antara_command(user_id)

    engine_pack['services']['nuptial_environment_service'].born_new_antara.assert_called_once_with(user_id)

@pytest.mark.asyncio
async def test_add_egg_player_command(inited_engine_adapter_engine_environment):
    engine_adapter_pack, engine_pack = inited_engine_adapter_engine_environment
    engine_adapter = engine_adapter_pack['engine_adapter']

    egg = MagicMock()
    egg.id = 777
    engine_pack['services']['colony_service'].add_egg.return_value = egg

    await engine_adapter.run_world_admin_command()

    user_id = 12
    nest_id = 77
    name = 'Fast Amigo'
    is_fertilized = True
    egg_id = await engine_adapter.add_egg_command(user_id, nest_id, name, is_fertilized)

    engine_pack['services']['colony_service'].add_egg.assert_called_once_with(user_id, nest_id, name, is_fertilized)
    assert egg_id == egg.id

@pytest.mark.asyncio
async def test_found_colony_player_command(inited_engine_adapter_engine_environment):
    engine_adapter_pack, engine_pack = inited_engine_adapter_engine_environment
    engine_adapter = engine_adapter_pack['engine_adapter']

    await engine_adapter.run_world_admin_command()

    user_id = 12
    queen_id = 18
    nuptial_male_id = 99
    nest_building_site = [100, 150]
    colony_name = 'super colony'
    await engine_adapter.found_colony_command(user_id, queen_id, nuptial_male_id, nest_building_site, colony_name)

    parsed_nest_building_site = Point.from_json(nest_building_site)
    engine_pack['services']['colony_service'].found_new_colony.assert_called_once_with(user_id, queen_id, nuptial_male_id, parsed_nest_building_site, colony_name)

